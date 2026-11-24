<?php
require 'conexao.php';

$_SESSION = [];
setcookie(session_name(), '', time() - 3600, '/');
session_destroy();
responder(['ok' => true]);
