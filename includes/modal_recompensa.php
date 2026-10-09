<?php
// =====================================================================
// modal_recompensa.php  (RF006 - protótipo 09)
// Janela de "Parabéns!" que aparece no fim da rodada dos dois jogos.
// Começa escondida (hidden). A função mostrarRecompensa() do geral.js
// preenche os números e faz ela aparecer.
// =====================================================================
?>
<div class="fundo-modal" id="modal-recompensa" hidden>
    <div class="modal">
        <div class="recompensa-figuras">
            <div class="moeda-grande" id="recompensa-moeda">+10</div>
            <img src="img/jardim/flor-rosa.svg" alt="Flor nova" id="recompensa-flor" class="recompensa-flor">
        </div>

        <h2>Parabéns!</h2>
        <p>Você completou a rodada e uma nova flor nasceu no seu jardim!</p>
        <p class="recompensa-acertos" id="recompensa-acertos"></p>

        <div class="pilulas">
            <span class="pilula pilula-moedas" id="recompensa-pilula-moedas">+10 moedas</span>
            <span class="pilula pilula-flor">+1 flor no jardim</span>
        </div>

        <a href="inicio.php" class="botao botao-verde">Continuar</a>
        <!-- location.reload() recarrega a página = começa uma rodada nova -->
        <button type="button" class="link-botao espaco-pequeno" onclick="location.reload()">Jogar de novo</button>
    </div>
</div>
