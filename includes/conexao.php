<?php
// =====================================================================
// conexao.php
// Faz a conexão com o banco de dados MySQL usando PDO.
// Todas as páginas que precisam do banco fazem:
//     require_once 'includes/conexao.php';
// e depois usam a variável $conexao.
// =====================================================================

// Dados de acesso ao banco.
// No XAMPP, o usuário padrão é "root" e a senha fica vazia.
$servidor = 'localhost';
$banco    = 'talkgarden';
$usuario  = 'root';
$senha    = '';

try {
    // Cria a conexão. O "charset=utf8mb4" garante que os acentos funcionem.
    $conexao = new PDO(
        "mysql:host=$servidor;dbname=$banco;charset=utf8mb4",
        $usuario,
        $senha
    );

    // Se der erro em alguma consulta, o PDO "avisa" com uma exceção
    // (assim fica mais fácil descobrir o problema).
    $conexao->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Os resultados das consultas vêm como array com o nome das colunas.
    // Exemplo: $linha['nome'] em vez de $linha[1].
    $conexao->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $erro) {
    // Se não conseguir conectar, para tudo e mostra uma mensagem simples.
    // (Não mostramos o erro técnico completo para não expor dados do servidor.)
    die('Erro ao conectar com o banco de dados. Verifique se o MySQL está ligado no XAMPP e se o banco "talkgarden" foi criado.');
}
