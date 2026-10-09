<?php
// =====================================================================
// estatisticas.php  (RF009 - Consultar estatísticas, protótipo 12)
// Mostra o % de acertos no vocabulário, as frases montadas, os dias de
// prática e um gráfico de barras com as atividades de cada dia da semana.
// O gráfico é feito só com <div>: a largura de cada barra é calculada aqui.
// =====================================================================

require_once 'includes/verifica_login.php';
require_once 'includes/conexao.php';
require_once 'includes/funcoes.php';

$responsavel_id = $_SESSION['responsavel_id'];

// ----- 1. % de acertos no vocabulário -----
// Regra: acertos de primeira ÷ total de palavras respondidas
$consulta = $conexao->prepare(
    "SELECT COALESCE(SUM(acertos_primeira), 0) AS acertos,
            COALESCE(SUM(total_itens), 0)      AS palavras
     FROM atividades
     WHERE responsavel_id = ? AND tipo = 'vocabulario'"
);
$consulta->execute([$responsavel_id]);
$vocabulario = $consulta->fetch();

if ($vocabulario['palavras'] > 0) {
    $porcentagem_acertos = round($vocabulario['acertos'] / $vocabulario['palavras'] * 100);
} else {
    $porcentagem_acertos = 0; // não dá para dividir por zero
}

// ----- 2. Frases montadas -----
$frases_montadas = contarFrasesMontadas($conexao, $responsavel_id);

// ----- 3. Dias de prática (quantos dias diferentes teve atividade) -----
$consulta = $conexao->prepare(
    'SELECT COUNT(DISTINCT DATE(data_hora)) FROM atividades WHERE responsavel_id = ?'
);
$consulta->execute([$responsavel_id]);
$dias_pratica = (int) $consulta->fetchColumn();

// ----- 4. Gráfico: atividades em cada dia DESTA semana (segunda a domingo) -----

// Pergunta ao MySQL qual é a data de hoje e a da segunda-feira desta semana.
// WEEKDAY() devolve 0 para segunda, 1 para terça ... 6 para domingo.
$datas = $conexao->query(
    'SELECT CURDATE() AS hoje, CURDATE() - INTERVAL WEEKDAY(CURDATE()) DAY AS segunda'
)->fetch();

// Conta as atividades de cada dia, a partir da segunda-feira
$consulta = $conexao->prepare(
    'SELECT DATE(data_hora) AS dia, COUNT(*) AS quantidade
     FROM atividades
     WHERE responsavel_id = ? AND DATE(data_hora) >= ?
     GROUP BY DATE(data_hora)'
);
$consulta->execute([$responsavel_id, $datas['segunda']]);

// Guarda num array com a data como chave: ['2026-10-06' => 2, '2026-10-08' => 1]
$atividades_por_dia = [];
foreach ($consulta->fetchAll() as $linha) {
    $atividades_por_dia[$linha['dia']] = (int) $linha['quantidade'];
}

// Monta os 7 dias, de segunda a domingo
$nomes_dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
$semana = [];
$dia = new DateTime($datas['segunda']);

for ($i = 0; $i < 7; $i++) {
    $data = $dia->format('Y-m-d');

    // Se não teve atividade nesse dia, a quantidade é 0
    $quantidade = 0;
    if (isset($atividades_por_dia[$data])) {
        $quantidade = $atividades_por_dia[$data];
    }

    $semana[] = [
        'nome'       => $nomes_dias[$i],
        'quantidade' => $quantidade,
        'hoje'       => ($data == $datas['hoje']),
    ];
    $dia->modify('+1 day');
}

// O dia com mais atividades fica com a barra cheia (100%).
// Os outros ficam proporcionais a ele.
$maior = 0;
foreach ($semana as $d) {
    if ($d['quantidade'] > $maior) {
        $maior = $d['quantidade'];
    }
}

// Existe alguma atividade registrada? (para mostrar a mensagem de vazio)
$tem_atividades = ($dias_pratica > 0);

$titulo_pagina = 'Estatísticas';
$menu_ativo    = 'estatisticas';
include 'includes/topo.php';
?>

<div class="pagina">
    <div class="cabecalho-pagina">
        <div>
            <h1>Estatísticas</h1>
            <p>Seu progresso nos últimos dias</p>
        </div>
    </div>

    <!-- Os 3 indicadores -->
    <div class="indicadores indicadores-grandes">
        <div class="indicador">
            <strong><?php echo $porcentagem_acertos; ?>%</strong>
            <span>Acertos no vocabulário</span>
        </div>
        <div class="indicador">
            <strong><?php echo $frases_montadas; ?></strong>
            <span>Frases montadas</span>
        </div>
        <div class="indicador">
            <strong><?php echo $dias_pratica; ?></strong>
            <span>Dias de prática</span>
        </div>
    </div>

    <!-- Gráfico de barras da semana -->
    <div class="cartao-grafico">
        <h2>Atividades desta semana</h2>

        <?php if (!$tem_atividades) { ?>
            <p class="sem-dados">Ainda não há atividades registradas.</p>
        <?php } ?>

        <?php foreach ($semana as $d) {
            // Largura da barra em %. Se ninguém jogou na semana, todas ficam 0.
            if ($maior > 0) {
                $largura = round($d['quantidade'] / $maior * 100);
            } else {
                $largura = 0;
            }
        ?>
            <div class="linha-grafico <?php if ($d['hoje']) echo 'hoje'; ?>">
                <span class="nome-dia"><?php echo $d['nome']; ?></span>
                <div class="trilho-barra">
                    <div class="barra" style="width: <?php echo $largura; ?>%"></div>
                </div>
                <span class="quantidade-dia"><?php echo $d['quantidade']; ?></span>
            </div>
        <?php } ?>
    </div>
</div>

<?php include 'includes/rodape.php'; ?>
