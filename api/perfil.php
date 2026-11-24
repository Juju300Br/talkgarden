<?php
require 'conexao.php';

$id = exigirLogin();
$dados = entrada();
$nome = trim($dados['nome'] ?? '');
$crianca = trim($dados['crianca'] ?? '');
$email = strtolower(trim($dados['email'] ?? ''));
$idade = ($dados['idade'] ?? '') === '' ? null : (int)$dados['idade'];
$avatar = $dados['avatar'] ?? 'pessoa';

if ($nome === '' || $crianca === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(['ok' => false, 'erro' => 'dados']);
}

$st = $pdo->prepare('SELECT 1 FROM responsavel WHERE email = ? AND id_responsavel <> ?');
$st->execute([$email, $id]);
if ($st->fetch()) {
    responder(['ok' => false, 'erro' => 'email']);
}

$pdo->prepare('UPDATE responsavel SET nome = ?, email = ? WHERE id_responsavel = ?')->execute([$nome, $email, $id]);
$pdo->prepare('UPDATE crianca SET nome = ?, idade = ?, avatar = ? WHERE id_crianca = ?')
    ->execute([$crianca, $idade, $avatar, idCrianca($pdo, $id)]);
responder(['ok' => true]);
