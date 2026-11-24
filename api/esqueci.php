<?php
require 'conexao.php';

$email = strtolower(trim(entrada()['email'] ?? ''));
$st = $pdo->prepare('SELECT 1 FROM responsavel WHERE email = ?');
$st->execute([$email]);
responder(['ok' => (bool)$st->fetch()]);
