<?php
// =====================================================================
// sair.php  (RF012 - Sair do sistema)
// Primeiro mostra a pergunta "Já vai embora?" (protótipo 15).
// Se a pessoa clicar em "Sair", o formulário é enviado (POST) e aí
// a sessão é encerrada e ela volta para o login.
// =====================================================================

require_once 'includes/verifica_login.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Apaga todos os dados guardados na sessão
    $_SESSION = [];

    // Apaga o cookie da sessão do navegador (data no passado = apagar)
    setcookie(session_name(), '', time() - 3600, '/');

    // Destrói a sessão no servidor
    session_destroy();

    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sair - TalkGarden</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/estilo.css">
</head>
<body class="pagina-cenario">

    <?php include 'includes/cenario.php'; ?>

    <!-- Camada escura por cima do cenário, para destacar a pergunta -->
    <div class="fundo-escuro"></div>

    <main class="cartao-acesso cartao-sair">
        <img src="img/mascote/abelha.svg" alt="" class="mascote-meio">

        <h1>Já vai embora?</h1>
        <p class="subtitulo">Seu jardim fica guardado. Volte logo para regar suas flores!</p>

        <div class="botoes-lado-a-lado">
            <a href="inicio.php" class="botao botao-contorno">Continuar jogando</a>

            <form method="POST">
                <button type="submit" class="botao botao-roxo">Sair</button>
            </form>
        </div>
    </main>

</body>
</html>
