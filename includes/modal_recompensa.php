<?php
// =====================================================================
// modal_recompensa.php
// As duas janelas que aparecem no fim da rodada dos jogos:
//   1) "Parabéns!" com as moedas e a flor nova (RF006 - protótipo 09)
//   2) "Nova conquista" quando ganha medalha (RF007 - protótipo 11)
// As duas começam escondidas (hidden). O geral.js preenche e mostra.
// =====================================================================
?>

<!-- ===== 1) Recompensa ===== -->
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

        <!-- Se ganhou medalha, mostra a conquista. Se não, volta para o início. -->
        <button type="button" class="botao botao-verde" onclick="continuarDepoisDaRecompensa()">Continuar</button>
        <!-- location.reload() recarrega a página = começa uma rodada nova -->
        <button type="button" class="link-botao espaco-pequeno" onclick="location.reload()">Jogar de novo</button>
    </div>
</div>

<!-- ===== 2) Conquista desbloqueada ===== -->
<div class="fundo-modal" id="modal-conquista" hidden>
    <div class="modal">
        <div class="medalha-destaque">
            <img src="img/medalhas/primeiro_passo.svg" alt="" id="conquista-icone">
        </div>

        <span class="etiqueta-conquista">NOVA CONQUISTA</span>
        <h2 id="conquista-nome">Medalha</h2>
        <p id="conquista-texto"></p>

        <a href="conquistas.php" class="botao botao-roxo espaco-cima">Ver minhas conquistas</a>
        <!-- Mostra a próxima medalha (se ganhou mais de uma) ou volta para o início -->
        <button type="button" class="link-botao espaco-pequeno" onclick="mostrarProximaConquista()">Continuar</button>
    </div>
</div>
