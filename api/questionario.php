<?php
require 'conexao.php';

$id = exigirLogin();
$dados = entrada();
$crianca = idCrianca($pdo, $id);
$diagnostico = $dados['diagnostico'] ?? '';
$sinais = implode(',', array_map('intval', $dados['sinais'] ?? []));
$idade = (int)($dados['idade'] ?? 0);

if (!in_array($diagnostico, ['sim', 'avaliacao', 'nao']) || $idade < 3 || $idade > 14) {
    responder(['ok' => false]);
}

$st = $pdo->prepare('INSERT INTO perfil_linguagem (id_crianca, diagnostico, sinais, idade) VALUES (?, ?, ?, ?)
                     ON DUPLICATE KEY UPDATE diagnostico = VALUES(diagnostico), sinais = VALUES(sinais),
                     idade = VALUES(idade), data_preenchimento = NOW()');
$st->execute([$crianca, $diagnostico, $sinais, $idade]);
$pdo->prepare('UPDATE crianca SET idade = ? WHERE id_crianca = ?')->execute([$idade, $crianca]);
responder(['ok' => true]);
