<?php
require 'conexao.php';

$dados = entrada();
$email = strtolower(trim($dados['email'] ?? ''));
$senha = $dados['senha'] ?? '';

$st = $pdo->prepare('SELECT id_responsavel, senha_hash FROM responsavel WHERE email = ?');
$st->execute([$email]);
$r = $st->fetch();

if (!$r || !password_verify($senha, $r['senha_hash'])) {
    responder(['ok' => false]);
}

session_regenerate_id(true);
$_SESSION['id_responsavel'] = $r['id_responsavel'];
if (!empty($dados['lembrar'])) {
    setcookie(session_name(), session_id(), time() + 60 * 60 * 24 * 30, '/');
}
responder(['ok' => true, 'user' => montarUsuario($pdo, $r['id_responsavel'])]);
