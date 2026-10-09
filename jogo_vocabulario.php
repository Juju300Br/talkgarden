<?php
// =====================================================================
// jogo_vocabulario.php  (RF003 - Jogo de Vocabulário, protótipo 08)
// O PHP só monta a página. Quem faz o jogo funcionar é o
// js/vocabulario.js (sorteia as palavras, confere as respostas etc.).
// =====================================================================

require_once 'includes/verifica_login.php';

$titulo_pagina = 'Jogo de Vocabulário';
$menu_ativo    = 'inicio';
$script_pagina = 'js/vocabulario.js';
include 'includes/topo.php';
?>

<div class="pagina">
    <!-- Cabeçalho: botão voltar + título -->
    <div class="cabecalho-pagina">
        <!-- Voltar no meio da rodada não salva nada (regra de negócio) -->
        <a href="inicio.php" class="botao-voltar" title="Voltar" aria-label="Voltar para o início">‹</a>
        <div>
            <h1>Jogo de Vocabulário</h1>
            <p>Toque na imagem que combina com a palavra</p>
        </div>
    </div>

    <div class="cartao-jogo">
        <!-- Progresso: "Palavra 1 de 5" e as bolinhas -->
        <div class="progresso-jogo">
            <span id="progresso-texto">Palavra 1 de 5</span>
            <div class="progresso-bolinhas" id="progresso-bolinhas"></div>
        </div>

        <!-- A palavra da vez (o JavaScript troca o texto) -->
        <div class="palavra-da-vez" id="palavra-atual">...</div>

        <!-- As 3 opções de imagem (o JavaScript cria os botões aqui dentro) -->
        <div class="opcoes-imagem" id="opcoes"></div>

        <!-- Mensagem de acerto/erro -->
        <p class="mensagem-jogo" id="mensagem"></p>
    </div>
</div>

<?php include 'includes/modal_recompensa.php'; ?>

<?php include 'includes/rodape.php'; ?>
