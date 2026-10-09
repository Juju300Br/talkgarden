<?php
// =====================================================================
// index.php
// Primeira página que abre em http://localhost/talkgarden
// Se já tem alguém logado, vai para o início. Se não, vai para o login.
// =====================================================================

require_once 'includes/sessao.php';

if (isset($_SESSION['responsavel_id'])) {
    header('Location: inicio.php');
} else {
    header('Location: login.php');
}
exit;
