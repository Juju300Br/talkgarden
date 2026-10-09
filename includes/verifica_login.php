<?php
// =====================================================================
// verifica_login.php
// Colocado no topo de TODAS as páginas internas (início, jogos, jardim...).
// Se ninguém fez login, manda a pessoa de volta para a tela de login.
// =====================================================================

require_once __DIR__ . '/sessao.php';

// Quando o login dá certo, guardamos o id do responsável na sessão.
// Se esse id não existir, quer dizer que ninguém está logado.
if (!isset($_SESSION['responsavel_id'])) {
    header('Location: login.php');
    exit; // para o PHP aqui, para não mostrar nada da página protegida
}
