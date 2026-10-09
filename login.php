<?php
// =====================================================================
// login.php  (RF001 - Efetuar login)
// O responsável entra com e-mail e senha.
// O formulário envia os dados para esta mesma página (method="POST").
// =====================================================================

require_once 'includes/sessao.php';
require_once 'includes/conexao.php';

// Se já tem alguém logado, não precisa fazer login de novo.
if (isset($_SESSION['responsavel_id'])) {
    header('Location: inicio.php');
    exit;
}

// Variáveis usadas no HTML lá embaixo
$email = '';   // para o e-mail continuar no campo se o login der errado
$erro  = '';   // mensagem de erro (fica vazia se não tiver erro)

// Este bloco só roda quando a pessoa clica em "Entrar"
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // trim() tira os espaços do começo e do fim.
    // O "?? ''" usa texto vazio caso o campo não tenha sido enviado.
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';

    if ($email == '' || $senha == '') {
        $erro = 'Preencha o e-mail e a senha para entrar.';
    } else {
        // Procura o responsável pelo e-mail (prepared statement: o "?" é
        // trocado pelo valor com segurança, sem risco de SQL Injection).
        $consulta = $conexao->prepare('SELECT id, senha, nome_crianca FROM responsaveis WHERE email = ?');
        $consulta->execute([$email]);
        $responsavel = $consulta->fetch();

        // password_verify() compara a senha digitada com o hash salvo no banco.
        if ($responsavel && password_verify($senha, $responsavel['senha'])) {
            // Cria um novo id de sessão (proteção contra roubo de sessão)
            session_regenerate_id(true);

            // Guarda na sessão quem está logado
            $_SESSION['responsavel_id'] = $responsavel['id'];
            $_SESSION['nome_crianca']   = $responsavel['nome_crianca'];

            // "Lembrar de mim": faz o cookie da sessão durar 30 dias.
            // Sem marcar, o cookie some quando o navegador é fechado.
            if (isset($_POST['lembrar'])) {
                setcookie(session_name(), session_id(), [
                    'expires'  => time() + 60 * 60 * 24 * 30,
                    'path'     => '/',
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);
            }

            header('Location: inicio.php');
            exit;
        } else {
            // Mesma mensagem para e-mail ou senha errados (assim ninguém
            // descobre quais e-mails estão cadastrados).
            $erro = 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
        }
    }
}

// Mensagem de sucesso quando a pessoa acabou de se cadastrar
$cadastro_ok = isset($_GET['cadastro']) && $_GET['cadastro'] == 'ok';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Entrar - TalkGarden</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/estilo.css">
</head>
<body class="pagina-cenario">

    <?php include 'includes/cenario.php'; ?>

    <main class="cartao-acesso">
        <img src="img/mascote/abelha.svg" alt="" class="mascote-topo">

        <div class="logo">
            <img src="img/logo.svg" alt="">
            <span><span class="logo-talk">Talk</span><span class="logo-garden">Garden</span></span>
        </div>

        <h1>Que bom te ver!</h1>
        <p class="subtitulo">Entre com a conta do responsável para a criança começar a brincar.</p>

        <?php if ($cadastro_ok) { ?>
            <div class="aviso aviso-sucesso">Conta criada com sucesso! Agora é só entrar.</div>
        <?php } ?>

        <?php if ($erro != '') { ?>
            <div class="aviso aviso-erro"><?php echo htmlspecialchars($erro); ?></div>
        <?php } ?>

        <!-- novalidate: desliga os balõezinhos do navegador, quem valida é o PHP -->
        <form method="POST" novalidate>
            <label for="email">E-mail</label>
            <input type="email" id="email" name="email"
                   class="campo <?php if ($erro != '') echo 'campo-erro'; ?>"
                   placeholder="seuemail@exemplo.com"
                   value="<?php echo htmlspecialchars($email); ?>">

            <label for="senha">Senha</label>
            <div class="campo-senha">
                <input type="password" id="senha" name="senha"
                       class="campo <?php if ($erro != '') echo 'campo-erro'; ?>"
                       placeholder="Digite sua senha">
                <!-- Botão do olhinho: mostra/esconde a senha (função em js/geral.js) -->
                <button type="button" class="botao-olho" onclick="mostrarSenha('senha')" aria-label="Mostrar ou esconder a senha">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/>
                        <circle cx="12" cy="12" r="3"/>
                    </svg>
                </button>
            </div>

            <div class="linha-opcoes">
                <label class="lembrar">
                    <input type="checkbox" name="lembrar" <?php if (isset($_POST['lembrar'])) echo 'checked'; ?>>
                    Lembrar de mim
                </label>
                <a href="recuperar_senha.php" class="link">Esqueceu a senha?</a>
            </div>

            <button type="submit" class="botao botao-roxo">Entrar</button>
        </form>

        <p class="rodape-cartao">Ainda não tem conta? <a href="cadastro.php" class="link">Cadastre-se</a></p>
    </main>

    <script src="js/geral.js"></script>
</body>
</html>
