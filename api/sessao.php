<?php
require 'conexao.php';

if (empty($_SESSION['id_responsavel'])) {
    responder(['ok' => false]);
}
responder(['ok' => true, 'user' => montarUsuario($pdo, $_SESSION['id_responsavel'])]);
