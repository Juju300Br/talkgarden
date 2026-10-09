<?php
// =====================================================================
// sessao.php
// Inicia a sessão do PHP (é ela que "lembra" quem fez login).
// Todas as páginas incluem este arquivo antes de usar $_SESSION.
// =====================================================================

// Deixa os dados da sessão guardados no servidor por até 30 dias.
// Isso é necessário para o "Lembrar de mim" funcionar.
// (60 segundos x 60 minutos x 24 horas x 30 dias)
ini_set('session.gc_maxlifetime', 60 * 60 * 24 * 30);

// O cookie da sessão só pode ser lido pelo servidor, não pelo JavaScript.
// É uma proteção básica de segurança.
ini_set('session.cookie_httponly', 1);

session_start();
