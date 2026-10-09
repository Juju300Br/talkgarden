<?php
// =====================================================================
// cadastro.php  (RF002 - Cadastrar nova conta)
// Cria a conta do responsável junto com o nome da criança.
// =====================================================================

require_once 'includes/sessao.php';
require_once 'includes/conexao.php';

// Quem já está logado não precisa se cadastrar.
if (isset($_SESSION['responsavel_id'])) {
    header('Location: inicio.php');
    exit;
}

// Valores dos campos (para não apagar o que a pessoa digitou se der erro)
$nome         = '';
$nome_crianca = '';
$email        = '';

// Lista de erros. Cada campo pode ter o seu: $erros['nome'], $erros['email']...
$erros = [];

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome            = trim($_POST['nome'] ?? '');
    $nome_crianca    = trim($_POST['nome_crianca'] ?? '');
    $email           = trim($_POST['email'] ?? '');
    $senha           = $_POST['senha'] ?? '';
    $confirmar_senha = $_POST['confirmar_senha'] ?? '';

    // ----- Validação de cada campo -----

    if ($nome == '') {
        $erros['nome'] = 'Informe seu nome';
    } elseif (mb_strlen($nome) > 100) {
        $erros['nome'] = 'Use no máximo 100 letras';
    }

    if ($nome_crianca == '') {
        $erros['nome_crianca'] = 'Informe o nome da criança';
    } elseif (mb_strlen($nome_crianca) > 100) {
        $erros['nome_crianca'] = 'Use no máximo 100 letras';
    }

    if ($email == '') {
        $erros['email'] = 'Informe seu e-mail';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
        // filter_var confere se o texto tem formato de e-mail (algo@algo.com)
        $erros['email'] = 'Digite um e-mail válido';
    } else {
        // Confere se o e-mail já está cadastrado (não pode repetir)
        $consulta = $conexao->prepare('SELECT id FROM responsaveis WHERE email = ?');
        $consulta->execute([$email]);
        if ($consulta->fetch()) {
            $erros['email'] = 'Este e-mail já está cadastrado';
        }
    }

    if (strlen($senha) < 6) {
        $erros['senha'] = 'A senha deve ter pelo menos 6 caracteres';
    }

    if ($confirmar_senha != $senha) {
        $erros['confirmar_senha'] = 'As senhas não são iguais';
    }

    // ----- Se não teve nenhum erro, salva no banco -----
    if (count($erros) == 0) {
        // Nunca salvamos a senha "pura": password_hash() gera um código
        // embaralhado que não dá para transformar de volta na senha.
        $senha_hash = password_hash($senha, PASSWORD_DEFAULT);

        $inserir = $conexao->prepare(
            'INSERT INTO responsaveis (nome, email, senha, nome_crianca, criado_em)
             VALUES (?, ?, ?, ?, NOW())'
        );
        $inserir->execute([$nome, $email, $senha_hash, $nome_crianca]);

        // Depois do cadastro, vai para o login com uma mensagem de sucesso
        header('Location: login.php?cadastro=ok');
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Criar conta - TalkGarden</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/estilo.css">
</head>
<body class="pagina-cenario">

    <?php include 'includes/cenario.php'; ?>

    <main class="cartao-acesso cartao-largo">
        <img src="img/mascote/abelha.svg" alt="" class="mascote-topo">

        <h1>Criar conta</h1>
        <p class="subtitulo">Cadastre o responsável e a criança que vai cuidar do jardim.</p>

        <form method="POST" novalidate>
            <!-- Duas colunas: nome do responsável e nome da criança -->
            <div class="grade-2">
                <div>
                    <label for="nome">Nome do responsável</label>
                    <input type="text" id="nome" name="nome" maxlength="100"
                           class="campo <?php if (isset($erros['nome'])) echo 'campo-erro'; ?>"
                           placeholder="Ex.: Maria Souza"
                           value="<?php echo htmlspecialchars($nome); ?>">
                    <?php if (isset($erros['nome'])) { ?>
                        <p class="msg-erro"><?php echo $erros['nome']; ?></p>
                    <?php } ?>
                </div>

                <div>
                    <label for="nome_crianca">Nome da criança</label>
                    <input type="text" id="nome_crianca" name="nome_crianca" maxlength="100"
                           class="campo <?php if (isset($erros['nome_crianca'])) echo 'campo-erro'; ?>"
                           placeholder="Ex.: Ana"
                           value="<?php echo htmlspecialchars($nome_crianca); ?>">
                    <?php if (isset($erros['nome_crianca'])) { ?>
                        <p class="msg-erro"><?php echo $erros['nome_crianca']; ?></p>
                    <?php } ?>
                </div>
            </div>

            <label for="email">E-mail</label>
            <input type="email" id="email" name="email" maxlength="150"
                   class="campo <?php if (isset($erros['email'])) echo 'campo-erro'; ?>"
                   placeholder="Ex.: maria.souza@email.com"
                   value="<?php echo htmlspecialchars($email); ?>">
            <?php if (isset($erros['email'])) { ?>
                <p class="msg-erro"><?php echo $erros['email']; ?></p>
            <?php } ?>

            <!-- Duas colunas: senha e confirmação -->
            <div class="grade-2">
                <div>
                    <label for="senha">Senha</label>
                    <input type="password" id="senha" name="senha"
                           class="campo <?php if (isset($erros['senha'])) echo 'campo-erro'; ?>"
                           placeholder="Mínimo 6 caracteres">
                    <?php if (isset($erros['senha'])) { ?>
                        <p class="msg-erro"><?php echo $erros['senha']; ?></p>
                    <?php } ?>
                </div>

                <div>
                    <label for="confirmar_senha">Confirmar senha</label>
                    <input type="password" id="confirmar_senha" name="confirmar_senha"
                           class="campo <?php if (isset($erros['confirmar_senha'])) echo 'campo-erro'; ?>"
                           placeholder="Repita a senha">
                    <?php if (isset($erros['confirmar_senha'])) { ?>
                        <p class="msg-erro"><?php echo $erros['confirmar_senha']; ?></p>
                    <?php } ?>
                </div>
            </div>

            <button type="submit" class="botao botao-verde espaco-cima">Cadastrar</button>
        </form>

        <p class="rodape-cartao">Já tem conta? <a href="login.php" class="link">Fazer login</a></p>
    </main>

</body>
</html>
