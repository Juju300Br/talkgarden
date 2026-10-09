<?php
// =====================================================================
// api/salvar_atividade.php  (RF006 - Conceder recompensas)
// Recebe do JavaScript (fetch) o resultado de uma rodada, em JSON:
//     { "tipo": "vocabulario", "total_itens": 5, "acertos_primeira": 4 }
// Salva a atividade (= 1 flor), soma as moedas, verifica as medalhas
// e responde em JSON:
//     { "ok": true, "moedas_ganhas": 18, "saldo": 138, "total_flores": 7,
//       "medalhas_novas": [ { "nome": "Jardim florido", "descricao": "...", "icone": "..." } ] }
// =====================================================================

// Este arquivo está dentro da pasta api/, por isso o "../" nos caminhos
require_once '../includes/sessao.php';
require_once '../includes/conexao.php';
require_once '../includes/funcoes.php';

// Avisa o navegador que a resposta é JSON (e não uma página HTML)
header('Content-Type: application/json; charset=utf-8');

// Responde com erro e para o PHP.
// $codigo = código HTTP (401 = não logado, 400 = dados errados...)
function responderErro($codigo, $mensagem)
{
    http_response_code($codigo);
    echo json_encode(['ok' => false, 'mensagem' => $mensagem], JSON_UNESCAPED_UNICODE);
    exit;
}

// ----- 1. Só aceita quem está logado e pedidos do tipo POST -----
if (!isset($_SESSION['responsavel_id'])) {
    responderErro(401, 'Sua sessão terminou. Faça login de novo.');
}
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    responderErro(405, 'Use o método POST.');
}
$responsavel_id = $_SESSION['responsavel_id'];

// ----- 2. Lê o JSON enviado pelo JavaScript -----
// php://input = o "corpo" do pedido. json_decode(..., true) transforma em array.
$dados = json_decode(file_get_contents('php://input'), true);
if (!is_array($dados)) {
    responderErro(400, 'Os dados da rodada vieram errados.');
}

$tipo             = $dados['tipo'] ?? '';
$total_itens      = (int) ($dados['total_itens'] ?? 0);
$acertos_primeira = (int) ($dados['acertos_primeira'] ?? 0);

// ----- 3. Confere se os dados fazem sentido -----
// Quantos itens cada jogo tem por rodada (regra dos RF003 e RF004).
// Isso impede que alguém mande "total_itens: 1000" para ganhar moedas.
$itens_por_jogo = [
    'vocabulario' => 5,
    'frases'      => 3,
];

if (!isset($itens_por_jogo[$tipo])) {
    responderErro(400, 'Tipo de jogo desconhecido.');
}
if ($total_itens != $itens_por_jogo[$tipo]) {
    responderErro(400, 'Quantidade de itens da rodada inválida.');
}
if ($acertos_primeira < 0 || $acertos_primeira > $total_itens) {
    responderErro(400, 'Quantidade de acertos inválida.');
}

// ----- 4. Calcula as moedas -----
// Regra: 10 moedas por rodada concluída + 2 moedas por acerto de primeira.
$moedas_ganhas = 10 + 2 * $acertos_primeira;

// ----- 5. Salva no banco -----
// Transação: as duas operações (salvar a atividade e somar as moedas)
// acontecem juntas. Se uma der erro, nenhuma é salva (rollBack).
try {
    $conexao->beginTransaction();

    $inserir = $conexao->prepare(
        'INSERT INTO atividades (responsavel_id, tipo, total_itens, acertos_primeira, moedas_ganhas, data_hora)
         VALUES (?, ?, ?, ?, ?, NOW())'
    );
    $inserir->execute([$responsavel_id, $tipo, $total_itens, $acertos_primeira, $moedas_ganhas]);

    $somar = $conexao->prepare('UPDATE responsaveis SET moedas = moedas + ? WHERE id = ?');
    $somar->execute([$moedas_ganhas, $responsavel_id]);

    // Depois da recompensa, confere as metas e desbloqueia medalhas (RF007).
    // Fica dentro da transação: se algo falhar, nada é salvo pela metade.
    $medalhas_novas = verificarMedalhas($conexao, $responsavel_id);

    $conexao->commit(); // confirma tudo
} catch (PDOException $erro) {
    $conexao->rollBack(); // desfaz tudo
    responderErro(500, 'Não consegui salvar a rodada.');
}

// ----- 6. Busca o saldo e o total de flores atualizados -----
$responsavel  = buscarResponsavel($conexao, $responsavel_id);
$total_flores = contarFlores($conexao, $responsavel_id);

// ----- 7. Responde para o JavaScript -----
echo json_encode([
    'ok'             => true,
    'moedas_ganhas'  => $moedas_ganhas,
    'saldo'          => (int) $responsavel['moedas'],
    'total_flores'   => $total_flores,
    'medalhas_novas' => $medalhas_novas,
], JSON_UNESCAPED_UNICODE);
