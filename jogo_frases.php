<?php
// =====================================================================
// jogo_frases.php  (RF004 - Formando Frases)
// Não tem protótipo: segue o mesmo estilo do Jogo de Vocabulário,
// com a cor rosa. A lógica do jogo fica no js/frases.js.
// =====================================================================

require_once 'includes/verifica_login.php';

$titulo_pagina = 'Formando Frases';
$menu_ativo    = 'inicio';
$script_pagina = 'js/frases.js';
include 'includes/topo.php';
?>

<div class="pagina">
    <!-- Cabeçalho: botão voltar + título -->
    <div class="cabecalho-pagina">
        <!-- Voltar no meio da rodada não salva nada (regra de negócio) -->
        <a href="inicio.php" class="botao-voltar" title="Voltar" aria-label="Voltar para o início">‹</a>
        <div>
            <h1 class="titulo-frases">Formando Frases</h1>
            <p>Toque nas palavras na ordem certa e depois em Confirmar</p>
        </div>
    </div>

    <div class="cartao-jogo">
        <!-- Progresso: "Frase 1 de 3" e as bolinhas -->
        <div class="progresso-jogo">
            <span id="progresso-texto">Frase 1 de 3</span>
            <div class="progresso-bolinhas" id="progresso-bolinhas"></div>
        </div>

        <!-- Imagem de apoio da frase (o JavaScript troca a imagem) -->
        <img src="" alt="" class="imagem-frase" id="imagem-frase">

        <!-- Área onde a frase vai sendo montada -->
        <div class="area-resposta" id="area-resposta">
            <span class="dica-resposta" id="dica-resposta">Toque nas palavras aqui embaixo</span>
        </div>

        <!-- Palavras embaralhadas para a criança escolher -->
        <div class="banco-palavras" id="banco-palavras"></div>

        <button type="button" class="botao botao-rosa botao-confirmar" id="botao-confirmar" disabled>Confirmar</button>

        <!-- Mensagem de acerto/erro -->
        <p class="mensagem-jogo" id="mensagem"></p>
    </div>
</div>

<?php include 'includes/modal_recompensa.php'; ?>

<?php include 'includes/rodape.php'; ?>
