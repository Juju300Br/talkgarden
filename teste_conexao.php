<?php
// =====================================================================
// teste_conexao.php
// Página SÓ PARA TESTE: verifica se o PHP consegue conectar no banco
// e se as medalhas iniciais foram cadastradas.
// Acesse: http://localhost/talkgarden/teste_conexao.php
// (Pode apagar este arquivo quando o projeto estiver pronto.)
// =====================================================================

// Se a conexão falhar, o próprio conexao.php mostra a mensagem de erro.
require_once 'includes/conexao.php';

// Busca todas as medalhas cadastradas no banco.
$consulta = $conexao->prepare('SELECT codigo, nome, requisito_texto FROM medalhas ORDER BY id');
$consulta->execute();
$medalhas = $consulta->fetchAll();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>Teste de conexão - TalkGarden</title>
    <style>
        body { font-family: Arial, sans-serif; background: #EAF6FF; padding: 30px; }
        .caixa { background: #fff; border-radius: 16px; padding: 24px; max-width: 600px; margin: auto; }
        .ok { color: #3F8F3F; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
    </style>
</head>
<body>
    <div class="caixa">
        <h1 class="ok">✔ Conexão com o banco funcionando!</h1>
        <p>Medalhas encontradas na tabela <strong>medalhas</strong>: <?php echo count($medalhas); ?></p>

        <table>
            <tr>
                <th>Código</th>
                <th>Nome</th>
                <th>Requisito</th>
            </tr>
            <?php foreach ($medalhas as $medalha) { ?>
                <tr>
                    <td><?php echo htmlspecialchars($medalha['codigo']); ?></td>
                    <td><?php echo htmlspecialchars($medalha['nome']); ?></td>
                    <td><?php echo htmlspecialchars($medalha['requisito_texto']); ?></td>
                </tr>
            <?php } ?>
        </table>
    </div>
</body>
</html>
