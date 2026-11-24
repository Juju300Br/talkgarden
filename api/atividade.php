<?php
require 'conexao.php';

$id = exigirLogin();
$dados = entrada();
$crianca = idCrianca($pdo, $id);
$tipos = ['vocab' => 'vocabulario', 'phrase' => 'frase', 'commands' => 'comando', 'story' => 'historia'];
$tipo = $tipos[$dados['jogo'] ?? ''] ?? null;
$moedas = max(0, (int)($dados['moedas'] ?? 0));

if (!$tipo) {
    responder(['ok' => false]);
}

$pdo->beginTransaction();
$st = $pdo->prepare('INSERT INTO atividade (id_crianca, tipo, acertos, total, moedas_ganhas) VALUES (?, ?, ?, ?, ?)');
$st->execute([$crianca, $tipo, (int)($dados['acertos'] ?? 0), (int)($dados['total'] ?? 0), $moedas]);
$atividade = $pdo->lastInsertId();

$pdo->prepare('INSERT INTO flor (id_crianca, id_atividade, tipo) VALUES (?, ?, ?)')
    ->execute([$crianca, $atividade, $dados['flor'] ?? 'broto']);
$pdo->prepare('UPDATE crianca SET moedas = moedas + ? WHERE id_crianca = ?')->execute([$moedas, $crianca]);

$st = $pdo->prepare('INSERT IGNORE INTO crianca_conquista (id_crianca, id_conquista) VALUES (?, ?)');
foreach ($dados['conquistas'] ?? [] as $c) {
    $st->execute([$crianca, $c]);
}
$pdo->commit();

responder(['ok' => true]);
