<?php
// =====================================================================
// jardim.php  (RF008 - Visualizar jardim, protótipo 10)
// Mostra as flores plantadas, os dias seguidos e o % do jardim completo.
// Se o jardim estiver vazio, mostra uma mensagem incentivando a jogar.
// =====================================================================

require_once 'includes/verifica_login.php';
require_once 'includes/conexao.php';
require_once 'includes/funcoes.php';

$responsavel_id = $_SESSION['responsavel_id'];

// Regra: o jardim completo tem 20 flores
$FLORES_JARDIM_COMPLETO = 20;

$total_flores   = contarFlores($conexao, $responsavel_id);
$dias_seguidos  = calcularDiasSeguidos($conexao, $responsavel_id);

// % completo = flores / 20 * 100, no máximo 100%
$porcentagem = min(round($total_flores / $FLORES_JARDIM_COMPLETO * 100), 100);

// Monta a lista das plantas, da mais antiga (1ª) para a mais nova.
// Cada planta tem um estágio (regra "cresce jogando") e uma cor.
$plantas = [];
for ($numero = 1; $numero <= $total_flores; $numero++) {
    // Quantas atividades vieram depois desta flor
    $atividades_depois = $total_flores - $numero;

    $estagio = estagioDaFlor($atividades_depois);
    $cor     = corDaFlor($numero);

    // Semente e broto são iguais para todas as cores
    if ($estagio == 'semente' || $estagio == 'broto') {
        $imagem = 'img/jardim/' . $estagio . '.svg';
    } else {
        $imagem = 'img/jardim/' . $estagio . '-' . $cor . '.svg';
    }

    $plantas[] = ['numero' => $numero, 'estagio' => $estagio, 'imagem' => $imagem];
}

// Espaços vazios de terra que ainda faltam para completar o jardim
$espacos_vazios = max($FLORES_JARDIM_COMPLETO - $total_flores, 0);

$titulo_pagina = 'Jardim';
$menu_ativo    = 'jardim';
include 'includes/topo.php';
?>

<div class="pagina">
    <div class="cabecalho-pagina">
        <div>
            <h1>Seu jardim</h1>
            <p>Cada atividade concluída faz uma nova flor nascer</p>
        </div>
    </div>

    <div class="painel-jardim">
        <!-- Os 3 números do topo -->
        <div class="indicadores">
            <div class="indicador">
                <strong><?php echo $total_flores; ?></strong>
                <span>Flores plantadas</span>
            </div>
            <div class="indicador">
                <strong><?php echo $dias_seguidos; ?></strong>
                <span>Dias seguidos</span>
            </div>
            <div class="indicador">
                <strong><?php echo $porcentagem; ?>%</strong>
                <span>Jardim completo</span>
            </div>
        </div>

        <?php if ($total_flores == 0) { ?>
            <!-- Jardim vazio: incentiva a jogar -->
            <div class="jardim-vazio">
                <img src="img/mascote/abelha.svg" alt="" class="jardim-vazio-abelha">
                <h2>Seu jardim está esperando por você!</h2>
                <p>Jogue uma atividade para plantar a primeira semente.</p>
                <a href="inicio.php" class="botao botao-verde">Vamos jogar <span class="seta-botao">›</span></a>
            </div>
        <?php } else { ?>
            <!-- Canteiro: as plantas e os espaços vazios -->
            <div class="canteiro">
                <?php foreach ($plantas as $planta) { ?>
                    <div class="espaco-planta" title="Flor <?php echo $planta['numero']; ?>: <?php echo $planta['estagio']; ?>">
                        <img src="<?php echo $planta['imagem']; ?>" alt="<?php echo $planta['estagio']; ?>">
                    </div>
                <?php } ?>

                <?php for ($i = 0; $i < $espacos_vazios; $i++) { ?>
                    <div class="espaco-planta vazio" title="Espaço livre"></div>
                <?php } ?>
            </div>

            <!-- Legenda dos estágios -->
            <p class="legenda-jardim">
                Cada flor nasce como semente e cresce a cada atividade que você faz:
                semente → broto → muda → flor.
            </p>
        <?php } ?>
    </div>
</div>

<?php include 'includes/rodape.php'; ?>
