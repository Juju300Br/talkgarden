<?php
// =====================================================================
// nova_senha.php  (RF013 - Criar nova senha, protótipo 06)
// Abre pelo link gerado no recuperar_senha.php:
//     nova_senha.php?token=abc123...
// Se o link for válido (existe, não foi usado e não passou de 1 hora),
// deixa criar uma senha nova.
// =====================================================================

require_once 'includes/sessao.php';
require_once 'includes/conexao.php';

// O token vem pelo link (GET) ou pelo campo escondido do formulário (POST)
$token = $_GET['token'] ?? $_POST['token'] ?? '';
if (!is_string($token)) {
    $token = ''; // proteção: o token precisa ser um texto
}

// No banco está o hash do token, então calculamos o hash para procurar
$token_hash = hash('sha256', $token);

// Procura um link válido: com esse token, ainda não usado e dentro do prazo.
// O prazo é conferido pelo MySQL (NOW()), o mesmo relógio que gravou o expira_em.
$consulta = $conexao->prepare(
    'SELECT id, responsavel_id FROM recuperacao_senha
     WHERE token = ? AND usado = 0 AND expira_em > NOW()'
);
$consulta->execute([$token_hash]);
$pedido = $consulta->fetch(); // false se o link for inválido, usado ou vencido

$erros = [];

if ($pedido && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $senha           = $_POST['senha'] ?? '';
    $confirmar_senha = $_POST['confirmar_senha'] ?? '';

    if (strlen($senha) < 6) {
        $erros['senha'] = 'A senha deve ter pelo menos 6 caracteres';
    }
    if ($confirmar_senha != $senha) {
        $erros['confirmar_senha'] = 'As senhas não são iguais';
    }

    if (count($erros) == 0) {
        // Transação: troca a senha e "queima" o link juntos
        $conexao->beginTransaction();

        $atualizar = $conexao->prepare('UPDATE responsaveis SET senha = ? WHERE id = ?');
        $atualizar->execute([password_hash($senha, PASSWORD_DEFAULT), $pedido['responsavel_id']]);

        $usar = $conexao->prepare('UPDATE recuperacao_senha SET usado = 1 WHERE id = ?');
        $usar->execute([$pedido['id']]);

        $conexao->commit();

        // Se alguém estava logado neste navegador, sai da conta,
        // para entrar de novo já com a senha nova.
        $_SESSION = [];
        session_destroy();

        header('Location: login.php?senha=ok');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nova senha - TalkGarden</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/estilo.css">
</head>
<body class="pagina-cenario">

    <?php include 'includes/cenario.php'; ?>

    <main class="cartao-acesso">
        <img src="img/mascote/abelha.svg" alt="" class="mascote-topo">

        <?php if (!$pedido) { ?>
            <!-- Link inválido, já usado ou vencido -->
            <h1>Este link não vale mais</h1>
            <p class="subtitulo">O link de redefinição já foi usado ou passou de 1 hora. Peça um link novo.</p>
            <a href="recuperar_senha.php" class="botao botao-roxo espaco-cima">Pedir um novo link</a>

        <?php } else { ?>
            <!-- Formulário da nova senha (protótipo 06) -->
            <h1>Criar nova senha</h1>
            <p class="subtitulo">Escolha uma nova senha de acesso para a sua conta.</p>

            <form method="POST" novalidate>
                <!-- O token vai escondido junto com o formulário -->
                <input type="hidden" name="token" value="<?php echo htmlspecialchars($token); ?>">

                <label for="senha">Nova senha</label>
                <div class="campo-senha">
                    <input type="password" id="senha" name="senha"
                           class="campo <?php if (isset($erros['senha'])) echo 'campo-erro'; ?>"
                           placeholder="Mínimo 6 caracteres">
                    <button type="button" class="botao-olho" onclick="mostrarSenha('senha')" aria-label="Mostrar ou esconder a senha">
                        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                            <circle cx="12" cy="12" r="3"/>
                        </svg>
                    </button>
                </div>
                <?php if (isset($erros['senha'])) { ?>
                    <p class="msg-erro"><?php echo $erros['senha']; ?></p>
                <?php } ?>

                <label for="confirmar_senha">Confirmar senha</label>
                <input type="password" id="confirmar_senha" name="confirmar_senha"
                       class="campo <?php if (isset($erros['confirmar_senha'])) echo 'campo-erro'; ?>"
                       placeholder="Repita a senha">
                <?php if (isset($erros['confirmar_senha'])) { ?>
                    <p class="msg-erro"><?php echo $erros['confirmar_senha']; ?></p>
                <?php } ?>

                <button type="submit" class="botao botao-roxo espaco-cima">Confirmar</button>
            </form>
        <?php } ?>

        <p class="rodape-cartao"><a href="login.php" class="link">‹ Voltar para o login</a></p>
    </main>

    <script src="js/geral.js"></script>
</body>
</html>
