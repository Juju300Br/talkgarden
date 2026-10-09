<?php
// =====================================================================
// inicio.php  (Tela inicial - protótipo 07)
// Mostra a saudação, o card "Seu jardim" e os dois jogos.
// =====================================================================

require_once 'includes/verifica_login.php';
require_once 'includes/conexao.php';
require_once 'includes/funcoes.php';

$total_flores = contarFlores($conexao, $_SESSION['responsavel_id']);

// ----- Card "Seu jardim": trilha de crescimento da PRIMEIRA flor -----
// Regra "cresce jogando": a flor sobe 1 estágio a cada atividade feita
// depois dela. Então, com 1 atividade a primeira flor é semente, com 2 é
// broto, com 3 é muda e com 4 ou mais já virou flor.
// min() pega o menor valor: nunca passa de 4 estágios.
$estagios_alcancados = min($total_flores, 4);

// Os 4 estágios, na ordem, com a imagem de cada um
$estagios = [
    ['nome' => 'Semente', 'imagem' => 'img/jardim/semente.svg'],
    ['nome' => 'Broto',   'imagem' => 'img/jardim/broto.svg'],
    ['nome' => 'Muda',    'imagem' => 'img/jardim/muda-rosa.svg'],
    ['nome' => 'Flor',    'imagem' => 'img/jardim/flor-rosa.svg'],
];

// Mensagem do card, de acordo com o progresso
if ($total_flores == 0) {
    $mensagem_jardim = 'Seu jardim está esperando a primeira semente. Vamos jogar?';
} elseif ($total_flores == 3) {
    $mensagem_jardim = 'Falta só 1 atividade para a primeira flor abrir!';
} elseif ($total_flores < 4) {
    $faltam = 4 - $total_flores;
    $mensagem_jardim = 'Faltam ' . $faltam . ' atividades para a primeira flor abrir!';
} else {
    $mensagem_jardim = 'Continue assim! Suas flores estão crescendo!';
}

// Monta o topo (menu lateral + barra de cima)
$titulo_pagina = 'Início';
$menu_ativo    = 'inicio';
include 'includes/topo.php';
?>

<!-- ===== Parte de cima: céu com a saudação ===== -->
<section class="inicio-ceu">
    <img src="img/cenario/nuvem.svg" alt="" class="inicio-nuvem">
    <img src="img/cenario/arvore.svg" alt="" class="inicio-arvore">

    <h1 class="inicio-titulo">Olá, pequeno jardineiro!</h1>
    <p class="inicio-texto">Vamos cuidar do seu jardim e aprender brincando hoje?</p>

    <div class="inicio-mascote-linha">
        <img src="img/mascote/abelha.svg" alt="Abelhinha" class="inicio-mascote">
        <div class="balao-fala">Escolha uma atividade para começarmos!</div>
    </div>
</section>

<!-- ===== Parte de baixo: grama com os 3 cards ===== -->
<section class="inicio-grama">
    <div class="cards-inicio">

        <!-- Card 1: Seu jardim -->
        <div class="card">
            <h2 class="card-titulo-jardim">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="#5AA845" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 21v-9"/>
                    <path d="M12 12C12 8 9 5 4 5c0 4 3 7 8 7z"/>
                    <path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7z"/>
                </svg>
                Seu jardim
            </h2>
            <p><?php echo $mensagem_jardim; ?></p>

            <!-- Trilha: imagem do estágio + bolinha (✓ = já alcançou) -->
            <div class="trilha">
                <?php
                for ($i = 0; $i < 4; $i++) {
                    $numero = $i + 1; // estágio 1, 2, 3 ou 4

                    // feito = já alcançou | proximo = é o próximo | futuro = ainda falta
                    if ($numero <= $estagios_alcancados) {
                        $situacao = 'feito';
                    } elseif ($numero == $estagios_alcancados + 1) {
                        $situacao = 'proximo';
                    } else {
                        $situacao = 'futuro';
                    }
                ?>
                    <div class="trilha-item <?php echo $situacao; ?>">
                        <div class="trilha-planta">
                            <img src="<?php echo $estagios[$i]['imagem']; ?>" alt="">
                        </div>
                        <div class="trilha-marca">
                            <span class="bolinha"><?php if ($situacao == 'feito') echo '✓'; ?></span>
                        </div>
                        <span class="trilha-nome"><?php echo $estagios[$i]['nome']; ?></span>
                    </div>
                <?php } ?>
            </div>
        </div>

        <!-- Card 2: Jogo de Vocabulário -->
        <div class="card card-vocabulario">
            <div class="previa">
                <span class="pilula-palavra">MAÇÃ</span>
                <img src="img/palavras/maca.svg" alt="">
                <img src="img/palavras/casa.svg" alt="">
                <img src="img/palavras/bola.svg" alt="">
            </div>
            <h2>Jogo de Vocabulário</h2>
            <p>Associe imagens às palavras e faça seu jardim crescer!</p>
            <a href="jogo_vocabulario.php" class="botao botao-verde">Jogar <span class="seta-botao">›</span></a>
        </div>

        <!-- Card 3: Formando Frases -->
        <div class="card card-frases">
            <div class="previa">
                <img src="img/frases/gato-leite.svg" alt="" class="previa-frase-imagem">
                <div class="chips">
                    <span class="chip-palavra">O</span>
                    <span class="chip-palavra">gato</span>
                    <span class="chip-palavra">bebe</span>
                    <span class="chip-palavra">leite</span>
                </div>
            </div>
            <h2>Formando Frases</h2>
            <p>Organize as palavras e crie frases lindas para o jardim florescer!</p>
            <a href="jogo_frases.php" class="botao botao-rosa">Jogar <span class="seta-botao">›</span></a>
        </div>

    </div>
</section>

<?php include 'includes/rodape.php'; ?>
