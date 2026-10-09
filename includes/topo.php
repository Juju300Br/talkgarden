<?php
// =====================================================================
// topo.php
// Parte de cima de todas as páginas internas: <head>, menu lateral roxo
// e barra do topo (logo, moedas, avatar da criança e engrenagem).
//
// Como usar (depois do verifica_login.php):
//     $titulo_pagina = 'Início';      // texto da aba do navegador
//     $menu_ativo    = 'inicio';      // item do menu que fica destacado
//     include 'includes/topo.php';
//     ... conteúdo da página ...
//     include 'includes/rodape.php';
// =====================================================================

require_once __DIR__ . '/conexao.php';
require_once __DIR__ . '/funcoes.php';

// Busca do banco os dados atualizados (as moedas mudam a cada jogo).
$responsavel = buscarResponsavel($conexao, $_SESSION['responsavel_id']);

// Se a conta não existe mais, encerra a sessão e volta para o login.
if (!$responsavel) {
    session_destroy();
    header('Location: login.php');
    exit;
}

// Função curtinha para não repetir o "if" em cada item do menu:
// devolve ' ativo' se for o item da página atual.
function classeMenu($item, $menu_ativo)
{
    if ($item == $menu_ativo) {
        return ' ativo';
    }
    return '';
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($titulo_pagina); ?> - TalkGarden</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/estilo.css">
</head>
<!-- data-som: 1 = som ligado, 0 = desligado (o JavaScript lê isso antes de tocar sons) -->
<body data-som="<?php echo (int) $responsavel['som_ligado']; ?>">
<div class="layout">

    <!-- ================= MENU LATERAL ================= -->
    <!-- Os ícones são desenhos SVG de linha (stroke="currentColor" usa a cor do texto) -->
    <nav class="menu-lateral">
        <a href="inicio.php" class="menu-mascote" aria-label="Início">
            <img src="img/mascote/abelha.svg" alt="">
        </a>

        <a href="inicio.php" class="menu-item<?php echo classeMenu('inicio', $menu_ativo); ?>" title="Início" aria-label="Início">
            <!-- Ícone: casinha -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 10.5 12 3l9 7.5"/>
                <path d="M5 9.5V20h5v-6h4v6h5V9.5"/>
            </svg>
        </a>

        <a href="jardim.php" class="menu-item<?php echo classeMenu('jardim', $menu_ativo); ?>" title="Jardim" aria-label="Jardim">
            <!-- Ícone: brotinho -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 21v-9"/>
                <path d="M12 12C12 8 9 5 4 5c0 4 3 7 8 7z"/>
                <path d="M12 12c0-4 3-7 8-7 0 4-3 7-8 7z"/>
            </svg>
        </a>

        <a href="estatisticas.php" class="menu-item<?php echo classeMenu('estatisticas', $menu_ativo); ?>" title="Estatísticas" aria-label="Estatísticas">
            <!-- Ícone: gráfico de barras -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 3v18h18"/>
                <rect x="7" y="12" width="3" height="6"/>
                <rect x="12" y="8" width="3" height="10"/>
                <rect x="17" y="5" width="3" height="13"/>
            </svg>
        </a>

        <a href="conquistas.php" class="menu-item<?php echo classeMenu('conquistas', $menu_ativo); ?>" title="Conquistas" aria-label="Conquistas">
            <!-- Ícone: medalha -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="5"/>
                <path d="M8.5 12.5 7 21l5-3 5 3-1.5-8.5"/>
            </svg>
        </a>

        <a href="sair.php" class="menu-item menu-sair" title="Sair" aria-label="Sair">
            <!-- Ícone: porta com seta -->
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <path d="M16 17l5-5-5-5"/>
                <path d="M21 12H9"/>
            </svg>
        </a>
    </nav>

    <div class="area-principal">

        <!-- ================= BARRA DO TOPO ================= -->
        <header class="barra-topo">
            <a href="inicio.php" class="logo logo-topo">
                <img src="img/logo.svg" alt="">
                <span><span class="logo-talk">Talk</span><span class="logo-garden">Garden</span></span>
            </a>

            <div class="topo-direita">
                <!-- Saldo de moedas. O id permite que os jogos (JavaScript) atualizem o número. -->
                <div class="saldo-moedas" title="Suas moedas">
                    <img src="img/moeda.svg" alt="Moedas">
                    <span id="saldo-moedas"><?php echo (int) $responsavel['moedas']; ?></span>
                </div>

                <!-- Avatar e nome da criança (leva para o perfil) -->
                <a href="perfil.php" class="topo-crianca" title="Perfil">
                    <img src="img/avatares/<?php echo htmlspecialchars($responsavel['avatar']); ?>" alt="">
                    <span><?php echo htmlspecialchars($responsavel['nome_crianca']); ?></span>
                </a>

                <!-- Engrenagem: perfil e configurações -->
                <a href="perfil.php" class="botao-engrenagem" title="Perfil e configurações" aria-label="Perfil e configurações">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </a>
            </div>
        </header>

        <!-- ================= CONTEÚDO DA PÁGINA ================= -->
        <main class="conteudo">
