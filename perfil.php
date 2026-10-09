<?php
// =====================================================================
// perfil.php  (RF011 - Manter perfil, protótipo 14)
// O responsável vê e edita: o nome dele, o nome da criança, o avatar,
// o e-mail e o som dos jogos (ligado/desligado).
// =====================================================================

require_once 'includes/verifica_login.php';
require_once 'includes/conexao.php';
require_once 'includes/funcoes.php';

$responsavel_id = $_SESSION['responsavel_id'];

// Avatares que podem ser escolhidos (arquivo => nome).
// Só aceitamos estes arquivos, para ninguém mandar um caminho estranho.
$avatares = [
    'abelha.svg' => 'Abelha',
    'coelho.svg' => 'Coelho',
    'gato.svg'   => 'Gato',
    'sapo.svg'   => 'Sapo',
    'urso.svg'   => 'Urso',
];

// Começa com os dados que estão no banco
$dados = buscarResponsavel($conexao, $responsavel_id);
$nome         = $dados['nome'];
$nome_crianca = $dados['nome_crianca'];
$email        = $dados['email'];
$avatar       = $dados['avatar'];
$som_ligado   = (int) $dados['som_ligado'];

$erros = [];

// ----- Clicou em "Salvar" -----
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nome         = trim($_POST['nome'] ?? '');
    $nome_crianca = trim($_POST['nome_crianca'] ?? '');
    $email        = trim($_POST['email'] ?? '');
    $avatar       = $_POST['avatar'] ?? '';

    // Checkbox desmarcado não é enviado. Se veio, o som está ligado (1); se não, desligado (0).
    if (isset($_POST['som_ligado'])) {
        $som_ligado = 1;
    } else {
        $som_ligado = 0;
    }

    // ----- Validação dos campos obrigatórios -----
    if ($nome == '') {
        $erros['nome'] = 'Este campo é obrigatório';
    } elseif (mb_strlen($nome) > 100) {
        $erros['nome'] = 'Use no máximo 100 letras';
    }

    if ($nome_crianca == '') {
        $erros['nome_crianca'] = 'Este campo é obrigatório';
    } elseif (mb_strlen($nome_crianca) > 100) {
        $erros['nome_crianca'] = 'Use no máximo 100 letras';
    }

    if ($email == '') {
        $erros['email'] = 'Este campo é obrigatório';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL) || mb_strlen($email) > 150) {
        $erros['email'] = 'Digite um e-mail válido';
    } else {
        // O e-mail não pode ser de OUTRA conta (o "id <> ?" ignora a própria conta)
        $consulta = $conexao->prepare('SELECT id FROM responsaveis WHERE email = ? AND id <> ?');
        $consulta->execute([$email, $responsavel_id]);
        if ($consulta->fetch()) {
            $erros['email'] = 'Este e-mail já é usado por outra conta';
        }
    }

    // isset($avatares[$avatar]) confere se o arquivo está na lista permitida
    if (!isset($avatares[$avatar])) {
        $erros['avatar'] = 'Escolha um dos avatares';
    }

    // ----- Sem erros: salva -----
    if (count($erros) == 0) {
        $atualizar = $conexao->prepare(
            'UPDATE responsaveis
             SET nome = ?, nome_crianca = ?, email = ?, avatar = ?, som_ligado = ?
             WHERE id = ?'
        );
        $atualizar->execute([$nome, $nome_crianca, $email, $avatar, $som_ligado, $responsavel_id]);

        // O nome da criança também fica guardado na sessão
        $_SESSION['nome_crianca'] = $nome_crianca;

        // Recarrega a página com a mensagem de sucesso.
        // (Assim, se apertar F5, o formulário não é enviado de novo.)
        header('Location: perfil.php?salvo=1');
        exit;
    }
}

$salvo = isset($_GET['salvo']);

$titulo_pagina = 'Perfil';
$menu_ativo    = 'perfil';
include 'includes/topo.php';
?>

<div class="pagina">
    <div class="cabecalho-pagina">
        <a href="inicio.php" class="botao-voltar" title="Voltar" aria-label="Voltar para o início">‹</a>
        <div>
            <h1>Perfil e configurações</h1>
            <p>Dados da conta do responsável e da criança</p>
        </div>
    </div>

    <?php if ($salvo) { ?>
        <div class="aviso aviso-sucesso aviso-pagina">Pronto! As alterações foram salvas.</div>
    <?php } ?>
    <?php if (count($erros) > 0) { ?>
        <div class="aviso aviso-erro aviso-pagina">Confira os campos marcados em rosa.</div>
    <?php } ?>

    <!-- Um formulário só, com as duas colunas dentro -->
    <form method="POST" class="grade-perfil" novalidate>

        <!-- ===== Coluna da esquerda: avatar e dados ===== -->
        <div class="card">
            <h2>Avatar da criança</h2>
            <p class="texto-ajuda">Escolha o bichinho que vai aparecer no topo da tela</p>

            <!-- Cada avatar é um "radio" escondido; a imagem é que aparece -->
            <div class="escolha-avatar">
                <?php foreach ($avatares as $arquivo => $nome_avatar) { ?>
                    <label class="opcao-avatar" title="<?php echo $nome_avatar; ?>">
                        <input type="radio" name="avatar" value="<?php echo $arquivo; ?>"
                               <?php if ($avatar == $arquivo) echo 'checked'; ?>>
                        <img src="img/avatares/<?php echo $arquivo; ?>" alt="<?php echo $nome_avatar; ?>">
                    </label>
                <?php } ?>
            </div>
            <?php if (isset($erros['avatar'])) { ?>
                <p class="msg-erro"><?php echo $erros['avatar']; ?></p>
            <?php } ?>

            <h2 class="espaco-titulo">Dados do perfil</h2>
            <p class="texto-ajuda">Campos com * são obrigatórios</p>

            <div class="grade-2">
                <div>
                    <label for="nome">Nome do responsável *</label>
                    <input type="text" id="nome" name="nome" maxlength="100"
                           class="campo <?php if (isset($erros['nome'])) echo 'campo-erro'; ?>"
                           value="<?php echo htmlspecialchars($nome); ?>">
                    <?php if (isset($erros['nome'])) { ?>
                        <p class="msg-erro"><?php echo $erros['nome']; ?></p>
                    <?php } ?>
                </div>

                <div>
                    <label for="nome_crianca">Nome da criança *</label>
                    <input type="text" id="nome_crianca" name="nome_crianca" maxlength="100"
                           class="campo <?php if (isset($erros['nome_crianca'])) echo 'campo-erro'; ?>"
                           value="<?php echo htmlspecialchars($nome_crianca); ?>">
                    <?php if (isset($erros['nome_crianca'])) { ?>
                        <p class="msg-erro"><?php echo $erros['nome_crianca']; ?></p>
                    <?php } ?>
                </div>
            </div>

            <label for="email">E-mail *</label>
            <input type="email" id="email" name="email" maxlength="150"
                   class="campo <?php if (isset($erros['email'])) echo 'campo-erro'; ?>"
                   value="<?php echo htmlspecialchars($email); ?>">
            <?php if (isset($erros['email'])) { ?>
                <p class="msg-erro"><?php echo $erros['email']; ?></p>
            <?php } ?>

            <div class="botoes-perfil">
                <button type="submit" class="botao botao-roxo">Salvar</button>
                <a href="inicio.php" class="botao botao-contorno">Cancelar</a>
            </div>
        </div>

        <!-- ===== Coluna da direita: configurações ===== -->
        <div class="card">
            <h2>Configurações</h2>
            <p class="texto-ajuda">Ajuste a plataforma para a criança</p>

            <div class="linha-config">
                <div>
                    <strong>Sons dos jogos</strong>
                    <span>Sons de acerto e erro nas atividades</span>
                </div>
                <!-- Interruptor: é um checkbox com cara de botão liga/desliga (feito no CSS) -->
                <label class="interruptor" title="Ligar ou desligar o som">
                    <input type="checkbox" name="som_ligado" value="1" <?php if ($som_ligado == 1) echo 'checked'; ?>>
                    <span class="trilho-interruptor"></span>
                </label>
            </div>

            <div class="linha-config">
                <div>
                    <strong>Alterar senha</strong>
                    <span>Crie uma senha nova para a conta</span>
                </div>
                <a href="recuperar_senha.php" class="link">Alterar</a>
            </div>
        </div>

    </form>
</div>

<?php include 'includes/rodape.php'; ?>
