<?php
// =====================================================================
// inicio.php
// VERSÃO PROVISÓRIA: só serve para testar o login da Etapa 2.
// A tela inicial de verdade (protótipo 07) será feita na Etapa 3.
// =====================================================================

require_once 'includes/verifica_login.php';
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Início - TalkGarden</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/estilo.css">
</head>
<body class="pagina-cenario">

    <?php include 'includes/cenario.php'; ?>

    <main class="cartao-acesso">
        <img src="img/mascote/abelha.svg" alt="" class="mascote-topo">

        <h1>Olá, <?php echo htmlspecialchars($_SESSION['nome_crianca']); ?>!</h1>
        <p class="subtitulo">Login feito com sucesso. A tela inicial completa chega na Etapa 3.</p>

        <a href="sair.php" class="botao botao-roxo espaco-cima">Sair</a>
    </main>

</body>
</html>
