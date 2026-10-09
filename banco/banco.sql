-- =====================================================================
-- TalkGarden - Script do banco de dados (MySQL)
-- Como usar: abra este arquivo no MySQL Workbench ou no phpMyAdmin
-- (aba "SQL" ou "Importar") e execute tudo de uma vez.
-- =====================================================================

-- Avisa o MySQL que este arquivo está escrito em UTF-8.
-- Sem isso, os acentos podem ser gravados errados (ex.: "SequÃªncia").
SET NAMES utf8mb4;

-- Cria o banco de dados, se ele ainda não existir.
-- utf8mb4 permite gravar acentos (ã, ç, é) e até emojis sem problema.
CREATE DATABASE IF NOT EXISTS talkgarden
    DEFAULT CHARACTER SET utf8mb4
    DEFAULT COLLATE utf8mb4_unicode_ci;

-- Diz ao MySQL que os próximos comandos são para o banco talkgarden.
USE talkgarden;

-- ---------------------------------------------------------------------
-- Tabela: responsaveis
-- Guarda a conta do responsável (pai, mãe ou professor) e os dados
-- da criança que usa essa conta.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS responsaveis (
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nome          VARCHAR(100) NOT NULL,
    email         VARCHAR(150) NOT NULL UNIQUE,          -- não pode repetir e-mail
    senha         VARCHAR(255) NOT NULL,                 -- guarda o hash do password_hash()
    nome_crianca  VARCHAR(100) NOT NULL,
    avatar        VARCHAR(50)  NOT NULL DEFAULT 'abelha.svg',
    som_ligado    TINYINT(1)   NOT NULL DEFAULT 1,       -- 1 = ligado, 0 = desligado
    moedas        INT          NOT NULL DEFAULT 0,
    criado_em     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabela: atividades
-- Cada rodada de jogo concluída vira 1 linha aqui (e 1 flor no jardim).
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS atividades (
    id                INT AUTO_INCREMENT PRIMARY KEY,
    responsavel_id    INT NOT NULL,
    tipo              ENUM('vocabulario', 'frases') NOT NULL,
    total_itens       INT NOT NULL,                      -- quantas palavras/frases tinha a rodada
    acertos_primeira  INT NOT NULL,                      -- quantas a criança acertou de primeira
    moedas_ganhas     INT NOT NULL,
    data_hora         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- Liga a atividade ao responsável. Se a conta for apagada,
    -- as atividades dela também são apagadas (ON DELETE CASCADE).
    FOREIGN KEY (responsavel_id) REFERENCES responsaveis(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabela: medalhas
-- Lista de todas as medalhas que existem no sistema.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medalhas (
    id               INT AUTO_INCREMENT PRIMARY KEY,
    codigo           VARCHAR(50)  NOT NULL UNIQUE,       -- usado no PHP para identificar a medalha
    nome             VARCHAR(100) NOT NULL,
    descricao        VARCHAR(255) NOT NULL,              -- aparece quando a medalha foi conquistada
    requisito_texto  VARCHAR(255) NOT NULL,              -- aparece quando a medalha ainda está bloqueada
    icone            VARCHAR(50)  NOT NULL               -- nome do arquivo SVG em img/medalhas/
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabela: medalhas_conquistadas
-- Registra quais medalhas cada responsável/criança já ganhou.
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS medalhas_conquistadas (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    responsavel_id  INT NOT NULL,
    medalha_id      INT NOT NULL,
    data_conquista  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    -- A mesma medalha não pode ser ganha duas vezes pela mesma conta.
    UNIQUE (responsavel_id, medalha_id),
    FOREIGN KEY (responsavel_id) REFERENCES responsaveis(id) ON DELETE CASCADE,
    FOREIGN KEY (medalha_id)     REFERENCES medalhas(id)     ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Tabela: recuperacao_senha
-- Guarda os códigos (tokens) gerados no "Esqueceu a senha?".
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recuperacao_senha (
    id              INT AUTO_INCREMENT PRIMARY KEY,
    responsavel_id  INT NOT NULL,
    token           VARCHAR(100) NOT NULL,
    expira_em       DATETIME NOT NULL,                   -- o link vale por 1 hora
    usado           TINYINT(1) NOT NULL DEFAULT 0,       -- 1 = já foi usado, não vale mais
    FOREIGN KEY (responsavel_id) REFERENCES responsaveis(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------------------------------------------------
-- Medalhas iniciais do sistema.
-- INSERT IGNORE: se o script for rodado de novo, não dá erro
-- de código repetido (ele simplesmente pula as que já existem).
-- ---------------------------------------------------------------------
INSERT IGNORE INTO medalhas (codigo, nome, descricao, requisito_texto, icone) VALUES
('primeiro_passo', 'Primeiro passo',      'Você concluiu sua primeira atividade!', 'Conclua 1 atividade.',              'primeiro_passo.svg'),
('jardim_florido', 'Jardim florido',      'Seu jardim já tem 5 flores!',           'Plante 5 flores no seu jardim.',    'jardim_florido.svg'),
('sequencia_7',    'Sequência de 7 dias', 'Você jogou 7 dias seguidos!',           'Jogue 7 dias seguidos.',            'sequencia_7.svg'),
('mestre_frases',  'Mestre das frases',   'Você montou 10 frases corretamente!',   'Monte 10 frases corretamente.',     'mestre_frases.svg');
