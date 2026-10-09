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
