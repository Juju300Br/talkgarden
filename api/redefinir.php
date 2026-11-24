<?php
require 'conexao.php';

$dados = entrada();
$email = strtolower(trim($dados['email'] ?? ''));
$senha = $dados['senha'] ?? '';

if (strlen($senha) < 6) {
    responder(['ok' => false]);
}
$st = $pdo->prepare('UPDATE responsavel SET senha_hash = ? WHERE email = ?');
$st->execute([password_hash($senha, PASSWORD_DEFAULT), $email]);
responder(['ok' => $st->rowCount() > 0]);
