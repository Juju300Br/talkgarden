<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

$pdo = new PDO('mysql:host=localhost;dbname=talkgarden;charset=utf8mb4', 'root', '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);

function entrada() {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

function responder($dados) {
    echo json_encode($dados, JSON_UNESCAPED_UNICODE);
    exit;
}

function exigirLogin() {
    if (empty($_SESSION['id_responsavel'])) {
        responder(['ok' => false, 'erro' => 'sessao']);
    }
    return $_SESSION['id_responsavel'];
}

function idCrianca($pdo, $idResponsavel) {
    $st = $pdo->prepare('SELECT id_crianca FROM crianca WHERE id_responsavel = ? ORDER BY id_crianca LIMIT 1');
    $st->execute([$idResponsavel]);
    return $st->fetchColumn();
}

function montarUsuario($pdo, $idResponsavel) {
    $st = $pdo->prepare('SELECT r.nome, r.email, r.criado_em, c.id_crianca, c.nome AS crianca, c.idade, c.avatar, c.moedas,
                                g.som_ativo, g.musica_ativa, g.leitura_voz_alta, g.letras_grandes
                         FROM responsavel r
                         JOIN crianca c ON c.id_responsavel = r.id_responsavel
                         JOIN configuracao g ON g.id_responsavel = r.id_responsavel
                         WHERE r.id_responsavel = ? ORDER BY c.id_crianca LIMIT 1');
    $st->execute([$idResponsavel]);
    $u = $st->fetch();
    $id = $u['id_crianca'];

    $st = $pdo->prepare('SELECT tipo, COUNT(*) AS qtd, SUM(acertos) AS acertos, SUM(total) AS total FROM atividade WHERE id_crianca = ? GROUP BY tipo');
    $st->execute([$id]);
    $jogos = [];
    foreach ($st as $l) $jogos[$l['tipo']] = $l;
    $soma = fn($tipo, $campo) => (int)($jogos[$tipo][$campo] ?? 0);

    $st = $pdo->prepare('SELECT tipo FROM flor WHERE id_crianca = ? ORDER BY id_flor');
    $st->execute([$id]);
    $flores = $st->fetchAll(PDO::FETCH_COLUMN);

    $st = $pdo->prepare('SELECT DATE(data) AS dia, COUNT(*) AS qtd FROM atividade WHERE id_crianca = ? GROUP BY DATE(data)');
    $st->execute([$id]);
    $log = [];
    foreach ($st as $l) $log[$l['dia']] = (int)$l['qtd'];

    $st = $pdo->prepare('SELECT id_conquista FROM crianca_conquista WHERE id_crianca = ? ORDER BY data_desbloqueio');
    $st->execute([$id]);
    $conquistas = $st->fetchAll(PDO::FETCH_COLUMN);

    $st = $pdo->prepare('SELECT diagnostico, sinais, idade, data_preenchimento FROM perfil_linguagem WHERE id_crianca = ?');
    $st->execute([$id]);
    $p = $st->fetch();
    $perfil = $p ? [
        'diagnostico' => $p['diagnostico'],
        'sinais' => $p['sinais'] === '' ? [] : array_map('intval', explode(',', $p['sinais'])),
        'idade' => (int)$p['idade'],
        'data' => strtotime($p['data_preenchimento']) * 1000,
    ] : null;

    return [
        'name' => $u['nome'],
        'email' => $u['email'],
        'childName' => $u['crianca'],
        'childAge' => $u['idade'] === null ? '' : (int)$u['idade'],
        'avatar' => $u['avatar'],
        'coins' => (int)$u['moedas'],
        'flowers' => $flores,
        'activities' => array_sum(array_map(fn($j) => (int)$j['qtd'], $jogos)),
        'phrases' => $soma('frase', 'qtd'),
        'historias' => $soma('historia', 'qtd'),
        'vocab' => ['hits' => $soma('vocabulario', 'acertos'), 'total' => $soma('vocabulario', 'total')],
        'comandos' => ['hits' => $soma('comando', 'acertos'), 'total' => $soma('comando', 'total')],
        'perfil' => $perfil,
        'log' => $log,
        'badges' => $conquistas,
        'lastBadge' => end($conquistas) ?: null,
        'settings' => [
            'sound' => (bool)$u['som_ativo'],
            'music' => (bool)$u['musica_ativa'],
            'voice' => (bool)$u['leitura_voz_alta'],
            'bigText' => (bool)$u['letras_grandes'],
        ],
        'createdAt' => strtotime($u['criado_em']) * 1000,
    ];
}
