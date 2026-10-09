<?php
// =====================================================================
// funcoes.php
// Funções usadas em várias páginas do TalkGarden.
// Todas recebem a $conexao (do conexao.php) e o id do responsável.
// =====================================================================

// Busca os dados do responsável logado (nome, criança, avatar, moedas...).
// Devolve um array com as colunas, ou false se a conta não existir.
function buscarResponsavel($conexao, $responsavel_id)
{
    $consulta = $conexao->prepare(
        'SELECT id, nome, email, nome_crianca, avatar, som_ligado, moedas
         FROM responsaveis WHERE id = ?'
    );
    $consulta->execute([$responsavel_id]);
    return $consulta->fetch();
}

// Conta quantas flores o jardim tem.
// Regra: cada atividade (rodada) concluída = 1 flor.
function contarFlores($conexao, $responsavel_id)
{
    $consulta = $conexao->prepare('SELECT COUNT(*) FROM atividades WHERE responsavel_id = ?');
    $consulta->execute([$responsavel_id]);
    return (int) $consulta->fetchColumn(); // fetchColumn pega só o número
}

// Conta quantas frases já foram montadas corretamente.
// Toda frase de uma rodada concluída foi montada certa (de primeira ou não),
// então é a soma do total_itens das atividades do tipo 'frases'.
function contarFrasesMontadas($conexao, $responsavel_id)
{
    // COALESCE(..., 0): se não tiver nenhuma rodada, a soma vem NULL; aí usamos 0
    $consulta = $conexao->prepare(
        "SELECT COALESCE(SUM(total_itens), 0) FROM atividades
         WHERE responsavel_id = ? AND tipo = 'frases'"
    );
    $consulta->execute([$responsavel_id]);
    return (int) $consulta->fetchColumn();
}

// Calcula os dias seguidos de uso.
// Regra: quantidade de dias consecutivos, até hoje, com pelo menos uma atividade.
// Exemplo: jogou hoje, ontem e anteontem (mas não antes) = 3 dias seguidos.
// Se não jogou hoje, a sequência é 0.
function calcularDiasSeguidos($conexao, $responsavel_id)
{
    // A data de "hoje" vem do MySQL (CURDATE), o mesmo relógio que grava as atividades.
    $hoje = $conexao->query('SELECT CURDATE()')->fetchColumn();

    // Lista os dias diferentes em que houve atividade, do mais recente para o mais antigo
    $consulta = $conexao->prepare(
        'SELECT DISTINCT DATE(data_hora) AS dia FROM atividades
         WHERE responsavel_id = ? ORDER BY dia DESC'
    );
    $consulta->execute([$responsavel_id]);
    $dias = $consulta->fetchAll(PDO::FETCH_COLUMN); // lista só com as datas: ['2026-10-09', '2026-10-08', ...]

    $sequencia = 0;
    $dia_esperado = new DateTime($hoje);

    // Vai conferindo dia por dia, de hoje para trás
    foreach ($dias as $dia) {
        if ($dia == $dia_esperado->format('Y-m-d')) {
            $sequencia++;
            $dia_esperado->modify('-1 day'); // agora espera o dia anterior
        } else {
            break; // pulou um dia: a sequência acabou
        }
    }
    return $sequencia;
}

// Confere as metas das medalhas e desbloqueia as que foram atingidas (RF007).
// Devolve uma lista só com as medalhas NOVAS (as que acabaram de ser ganhas).
function verificarMedalhas($conexao, $responsavel_id)
{
    $flores = contarFlores($conexao, $responsavel_id);
    $dias   = calcularDiasSeguidos($conexao, $responsavel_id);
    $frases = contarFrasesMontadas($conexao, $responsavel_id);

    // Para cada medalha: true se a meta foi atingida, false se ainda não
    $metas = [
        'primeiro_passo' => $flores >= 1,   // concluir 1 atividade
        'jardim_florido' => $flores >= 5,   // ter 5 flores
        'sequencia_7'    => $dias >= 7,     // jogar 7 dias seguidos
        'mestre_frases'  => $frases >= 10,  // montar 10 frases
    ];

    $novas = [];

    foreach ($metas as $codigo => $atingiu) {
        if (!$atingiu) {
            continue; // pula para a próxima medalha
        }

        $consulta = $conexao->prepare('SELECT id, codigo, nome, descricao, icone FROM medalhas WHERE codigo = ?');
        $consulta->execute([$codigo]);
        $medalha = $consulta->fetch();
        if (!$medalha) {
            continue;
        }

        // INSERT IGNORE: se a criança já tem essa medalha, o UNIQUE da tabela
        // impede a repetição e o MySQL simplesmente ignora (rowCount = 0).
        $inserir = $conexao->prepare(
            'INSERT IGNORE INTO medalhas_conquistadas (responsavel_id, medalha_id, data_conquista)
             VALUES (?, ?, NOW())'
        );
        $inserir->execute([$responsavel_id, $medalha['id']]);

        if ($inserir->rowCount() == 1) {
            $novas[] = $medalha; // inseriu agora = medalha nova!
        }
    }

    return $novas;
}

// Monta o texto de "o que falta" de uma medalha bloqueada (RF010).
// Devolve um array com 'atual', 'meta' e 'texto'.
function progressoMedalha($codigo, $flores, $dias, $frases)
{
    // Para cada medalha: quanto já tem, qual é a meta e o nome da coisa
    // no singular e no plural (para escrever "Falta 1 flor" ou "Faltam 3 flores")
    if ($codigo == 'primeiro_passo') {
        $atual = $flores;
        $meta = 1;
        $singular = 'atividade para concluir';
        $plural   = 'atividades para concluir';
    } elseif ($codigo == 'jardim_florido') {
        $atual = $flores;
        $meta = 5;
        $singular = 'flor no seu jardim';
        $plural   = 'flores no seu jardim';
    } elseif ($codigo == 'sequencia_7') {
        $atual = $dias;
        $meta = 7;
        $singular = 'dia seguido de jogo';
        $plural   = 'dias seguidos de jogo';
    } else { // mestre_frases
        $atual = $frases;
        $meta = 10;
        $singular = 'frase para montar';
        $plural   = 'frases para montar';
    }

    $atual  = min($atual, $meta); // nunca passa da meta
    $faltam = $meta - $atual;

    if ($faltam == 1) {
        $texto = 'Falta 1 ' . $singular . '.';
    } else {
        $texto = 'Faltam ' . $faltam . ' ' . $plural . '.';
    }

    return ['atual' => $atual, 'meta' => $meta, 'texto' => $texto];
}
