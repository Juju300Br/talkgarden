<?php
require 'conexao.php';

$dados = entrada();
$nome = trim($dados['nome'] ?? '');
$crianca = trim($dados['crianca'] ?? '');
$email = strtolower(trim($dados['email'] ?? ''));
$senha = $dados['senha'] ?? '';

if ($nome === '' || $crianca === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($senha) < 6) {
    responder(['ok' => false, 'erro' => 'dados']);
}

$st = $pdo->prepare('SELECT 1 FROM responsavel WHERE email = ?');
$st->execute([$email]);
if ($st->fetch()) {
    responder(['ok' => false, 'erro' => 'email']);
}

$pdo->beginTransaction();
$st = $pdo->prepare('INSERT INTO responsavel (nome, email, senha_hash) VALUES (?, ?, ?)');
$st->execute([$nome, $email, password_hash($senha, PASSWORD_DEFAULT)]);
$id = $pdo->lastInsertId();
$pdo->prepare('INSERT INTO configuracao (id_responsavel) VALUES (?)')->execute([$id]);
$pdo->prepare('INSERT INTO crianca (id_responsavel, nome) VALUES (?, ?)')->execute([$id, $crianca]);
$pdo->commit();

responder(['ok' => true]);
