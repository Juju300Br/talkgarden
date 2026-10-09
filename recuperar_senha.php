<?php
// =====================================================================
// recuperar_senha.php  (RF013 - Recuperar senha, protótipos 04 e 05)
// O responsável informa o e-mail e o sistema gera um link para criar
// uma senha nova. O link vale por 1 hora e só pode ser usado uma vez.
//
// VERSÃO SIMPLIFICADA ("modo demonstração"):
// o XAMPP não envia e-mail sem configurar um servidor SMTP, então o link
// é MOSTRADO NA TELA em vez de ser enviado por e-mail.
// ATENÇÃO: isso só serve para apresentar o projeto. Num site de verdade,
// qualquer pessoa que soubesse um e-mail conseguiria trocar a senha dele!
// =====================================================================

require_once 'includes/sessao.php';
require_once 'includes/conexao.php';

// true = mostra o link na tela (apresentação do TCC)
const MODO_DEMONSTRACAO = true;

$email = '';
$erro  = '';
$link  = '';      // fica preenchido quando o link é gerado
$enviado = false; // true = mostra a tela "Verifique seu e-mail"

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $email = trim($_POST['email'] ?? '');

    if ($email == '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $erro = 'Digite um e-mail válido.';
    } else {
        $consulta = $conexao->prepare('SELECT id FROM responsaveis WHERE email = ?');
        $consulta->execute([$email]);
        $responsavel = $consulta->fetch();

        if (!$responsavel) {
            $erro = 'Não encontramos uma conta com este e-mail. Confira se digitou certo.';
        } else {
            // ----- Gera o token (o "código secreto" do link) -----
            // random_bytes(32) sorteia 32 bytes aleatórios e bin2hex() transforma
            // em 64 letras/números. É impossível de adivinhar.
            $token = bin2hex(random_bytes(32));

            // No banco guardamos só o HASH do token (como fazemos com a senha).
            // Assim, mesmo quem visse o banco não conseguiria montar o link.
            $token_hash = hash('sha256', $token);

            // Cancela os links antigos que ainda não foram usados
            $cancelar = $conexao->prepare(
                'UPDATE recuperacao_senha SET usado = 1 WHERE responsavel_id = ? AND usado = 0'
            );
            $cancelar->execute([$responsavel['id']]);

            // Salva o novo link, valendo por 1 hora a partir de agora
            $inserir = $conexao->prepare(
                'INSERT INTO recuperacao_senha (responsavel_id, token, expira_em, usado)
                 VALUES (?, ?, NOW() + INTERVAL 1 HOUR, 0)'
            );
            $inserir->execute([$responsavel['id'], $token_hash]);

            // Monta o endereço completo do link.
            // dirname($_SERVER['SCRIPT_NAME']) = a pasta do projeto (ex.: /talkgarden)
            $link = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['SCRIPT_NAME'])
                  . '/nova_senha.php?token=' . $token;

            $enviado = true;
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperar senha - TalkGarden</title>
    <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/estilo.css">
</head>
<body class="pagina-cenario">

    <?php include 'includes/cenario.php'; ?>

    <main class="cartao-acesso">
        <img src="img/mascote/abelha.svg" alt="" class="mascote-topo">

        <?php if (!$enviado) { ?>
            <!-- ===== Tela 1: digitar o e-mail (protótipo 04) ===== -->
            <h1>Esqueceu a senha?</h1>
            <p class="subtitulo">Sem problemas! Digite o e-mail cadastrado e enviaremos um link para criar uma nova senha.</p>

            <?php if ($erro != '') { ?>
                <div class="aviso aviso-erro"><?php echo htmlspecialchars($erro); ?></div>
            <?php } ?>

            <form method="POST" novalidate>
                <label for="email">E-mail cadastrado</label>
                <input type="email" id="email" name="email"
                       class="campo <?php if ($erro != '') echo 'campo-erro'; ?>"
                       placeholder="seuemail@exemplo.com"
                       value="<?php echo htmlspecialchars($email); ?>">

                <button type="submit" class="botao botao-roxo espaco-cima">Enviar</button>
            </form>

        <?php } else { ?>
            <!-- ===== Tela 2: "Verifique seu e-mail" (protótipo 05) ===== -->
            <div class="icone-envelope">
                <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="#4E9F4E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="5" width="18" height="14" rx="2"/>
                    <path d="m3 7 9 6 9-6"/>
                </svg>
            </div>

            <h1>Verifique seu e-mail</h1>
            <p class="subtitulo">
                Enviamos um link de redefinição de senha para
                <strong><?php echo htmlspecialchars($email); ?></strong>.
            </p>

            <?php if (MODO_DEMONSTRACAO) { ?>
                <!-- No modo demonstração, o link aparece aqui em vez de ir por e-mail -->
                <div class="caixa-demonstracao">
                    <strong>Modo demonstração</strong>
                    <p>O XAMPP não envia e-mails, então o link aparece aqui. Ele vale por 1 hora.</p>
                    <a href="<?php echo htmlspecialchars($link); ?>" class="link-demonstracao"><?php echo htmlspecialchars($link); ?></a>
                </div>

                <a href="<?php echo htmlspecialchars($link); ?>" class="botao botao-roxo espaco-cima">Abrir link recebido</a>
            <?php } ?>
        <?php } ?>

        <p class="rodape-cartao"><a href="login.php" class="link">‹ Voltar para o login</a></p>
    </main>

</body>
</html>
