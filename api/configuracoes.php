<?php
require 'conexao.php';

$id = exigirLogin();
$c = entrada();
$st = $pdo->prepare('UPDATE configuracao SET som_ativo = ?, musica_ativa = ?, leitura_voz_alta = ?, letras_grandes = ? WHERE id_responsavel = ?');
$st->execute([(int)!empty($c['sound']), (int)!empty($c['music']), (int)!empty($c['voice']), (int)!empty($c['bigText']), $id]);
responder(['ok' => true]);
