<?php
// =====================================================================
// conquistas.php  (RF010 - Visualizar conquistas, protótipo 13)
// Lista as medalhas ganhas (nome + descrição) e as bloqueadas
// (cadeado + "Ainda bloqueado"). Ao tocar numa bloqueada, mostra o que falta.
// =====================================================================

require_once 'includes/verifica_login.php';
require_once 'includes/conexao.php';
require_once 'includes/funcoes.php';

$responsavel_id = $_SESSION['responsavel_id'];

// Busca TODAS as medalhas. O LEFT JOIN traz junto a data da conquista,
// que vem vazia (NULL) quando a criança ainda não ganhou aquela medalha.
$consulta = $conexao->prepare(
    'SELECT m.codigo, m.nome, m.descricao, m.requisito_texto, m.icone, mc.data_conquista
     FROM medalhas m
     LEFT JOIN medalhas_conquistadas mc
            ON mc.medalha_id = m.id AND mc.responsavel_id = ?
     ORDER BY m.id'
);
$consulta->execute([$responsavel_id]);
$medalhas = $consulta->fetchAll();

// Números usados para mostrar o progresso das medalhas bloqueadas
$flores = contarFlores($conexao, $responsavel_id);
$dias   = calcularDiasSeguidos($conexao, $responsavel_id);
$frases = contarFrasesMontadas($conexao, $responsavel_id);

$titulo_pagina = 'Conquistas';
$menu_ativo    = 'conquistas';
include 'includes/topo.php';
?>

<div class="pagina">
    <div class="cabecalho-pagina">
        <div>
            <h1>Conquistas</h1>
            <p>Continue jogando para desbloquear novas medalhas</p>
        </div>
    </div>

    <div class="grade-medalhas">
        <?php foreach ($medalhas as $medalha) { ?>

            <?php if ($medalha['data_conquista'] != null) { ?>
                <!-- Medalha conquistada -->
                <div class="cartao-medalha">
                    <img src="img/medalhas/<?php echo htmlspecialchars($medalha['icone']); ?>" alt="" class="icone-medalha">
                    <h2><?php echo htmlspecialchars($medalha['nome']); ?></h2>
                    <p><?php echo htmlspecialchars($medalha['descricao']); ?></p>
                    <span class="data-conquista">
                        Conquistada em <?php echo date('d/m/Y', strtotime($medalha['data_conquista'])); ?>
                    </span>
                </div>

            <?php } else {
                $progresso = progressoMedalha($medalha['codigo'], $flores, $dias, $frases);
                // Porcentagem para a barrinha de progresso (ex.: 3 de 5 = 60%)
                $porcentagem = round($progresso['atual'] / $progresso['meta'] * 100);
            ?>
                <!-- Medalha bloqueada: <details> abre e fecha sozinho ao tocar (sem JavaScript) -->
                <details class="cartao-medalha bloqueada">
                    <summary>
                        <img src="img/medalhas/bloqueada.svg" alt="" class="icone-medalha">
                        <h2><?php echo htmlspecialchars($medalha['nome']); ?></h2>
                        <p>Ainda bloqueado</p>
                        <span class="dica-toque">Toque para ver o que falta</span>
                    </summary>

                    <div class="o-que-falta">
                        <strong><?php echo htmlspecialchars($medalha['requisito_texto']); ?></strong>
                        <div class="barra-progresso">
                            <div class="barra-preenchida" style="width: <?php echo $porcentagem; ?>%"></div>
                        </div>
                        <span><?php echo $progresso['atual']; ?> de <?php echo $progresso['meta']; ?></span>
                        <p><?php echo $progresso['texto']; ?></p>
                    </div>
                </details>
            <?php } ?>

        <?php } ?>
    </div>
</div>

<?php include 'includes/rodape.php'; ?>
