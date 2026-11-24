DROP DATABASE IF EXISTS talkgarden;
CREATE DATABASE talkgarden CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE talkgarden;

CREATE TABLE responsavel (
  id_responsavel INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(120) NOT NULL UNIQUE,
  senha_hash VARCHAR(255) NOT NULL,
  criado_em DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE configuracao (
  id_configuracao INT AUTO_INCREMENT PRIMARY KEY,
  id_responsavel INT NOT NULL UNIQUE,
  som_ativo BOOLEAN NOT NULL DEFAULT TRUE,
  musica_ativa BOOLEAN NOT NULL DEFAULT FALSE,
  leitura_voz_alta BOOLEAN NOT NULL DEFAULT TRUE,
  letras_grandes BOOLEAN NOT NULL DEFAULT FALSE,
  FOREIGN KEY (id_responsavel) REFERENCES responsavel(id_responsavel) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE crianca (
  id_crianca INT AUTO_INCREMENT PRIMARY KEY,
  id_responsavel INT NOT NULL,
  nome VARCHAR(60) NOT NULL,
  idade INT NULL,
  avatar VARCHAR(20) NOT NULL DEFAULT 'pessoa',
  moedas INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id_responsavel) REFERENCES responsavel(id_responsavel) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE perfil_linguagem (
  id_perfil INT AUTO_INCREMENT PRIMARY KEY,
  id_crianca INT NOT NULL UNIQUE,
  diagnostico ENUM('sim','avaliacao','nao') NOT NULL,
  sinais VARCHAR(50) NOT NULL DEFAULT '',
  idade INT NOT NULL,
  data_preenchimento DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE atividade (
  id_atividade INT AUTO_INCREMENT PRIMARY KEY,
  id_crianca INT NOT NULL,
  tipo ENUM('vocabulario','frase','comando','historia') NOT NULL,
  data DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  acertos INT NOT NULL DEFAULT 0,
  total INT NOT NULL DEFAULT 0,
  moedas_ganhas INT NOT NULL DEFAULT 0,
  FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE flor (
  id_flor INT AUTO_INCREMENT PRIMARY KEY,
  id_crianca INT NOT NULL,
  id_atividade INT NULL,
  tipo VARCHAR(20) NOT NULL,
  data_plantio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
  FOREIGN KEY (id_atividade) REFERENCES atividade(id_atividade) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE conquista (
  id_conquista VARCHAR(20) PRIMARY KEY,
  nome VARCHAR(60) NOT NULL,
  descricao VARCHAR(150) NOT NULL
) ENGINE=InnoDB;

CREATE TABLE crianca_conquista (
  id_crianca INT NOT NULL,
  id_conquista VARCHAR(20) NOT NULL,
  data_desbloqueio DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_crianca, id_conquista),
  FOREIGN KEY (id_crianca) REFERENCES crianca(id_crianca) ON DELETE CASCADE,
  FOREIGN KEY (id_conquista) REFERENCES conquista(id_conquista)
) ENGINE=InnoDB;

INSERT INTO conquista (id_conquista, nome, descricao) VALUES
('primeiro', 'Primeiro passo', 'Concluiu a 1ª atividade'),
('florido', 'Jardim florido', '5 flores plantadas'),
('sequencia', 'Sequência de 7 dias', 'Jogou 7 dias seguidos'),
('mestre', 'Mestre das frases', 'Montou 25 frases'),
('palavras', 'Caçador de palavras', 'Acertou 50 palavras'),
('cofrinho', 'Cofrinho cheio', 'Juntou 300 moedas'),
('ouvinte', 'Bom ouvinte', 'Acertou 20 comandos'),
('contador', 'Contador de histórias', 'Organizou 10 histórias');

INSERT INTO responsavel (id_responsavel, nome, email, senha_hash) VALUES
(1, 'Ana Souza', 'demo@talkgarden.com', '$2y$12$ocxFPM/UsuoeDU4I/ReWIusWpjVO8LK7CYWDDCS3ZaZP1hz8KSMCi');
INSERT INTO configuracao (id_responsavel) VALUES (1);
INSERT INTO crianca (id_crianca, id_responsavel, nome, idade, avatar, moedas) VALUES (1, 1, 'Ju', 7, 'pessoa', 106);
INSERT INTO perfil_linguagem (id_crianca, diagnostico, sinais, idade) VALUES (1, 'avaliacao', '0,1,3', 7);

INSERT INTO atividade (id_crianca, tipo, data, acertos, total, moedas_ganhas) VALUES
(1, 'vocabulario', NOW() - INTERVAL 12 DAY, 3, 3, 10),
(1, 'vocabulario', NOW() - INTERVAL 10 DAY, 2, 3, 7),
(1, 'frase',       NOW() - INTERVAL 10 DAY, 1, 1, 10),
(1, 'comando',     NOW() - INTERVAL 9 DAY,  3, 4, 8),
(1, 'vocabulario', NOW() - INTERVAL 3 DAY,  3, 3, 10),
(1, 'historia',    NOW() - INTERVAL 3 DAY,  1, 1, 10),
(1, 'frase',       NOW() - INTERVAL 2 DAY,  1, 1, 10),
(1, 'comando',     NOW() - INTERVAL 2 DAY,  4, 4, 10),
(1, 'vocabulario', NOW() - INTERVAL 1 DAY,  2, 3, 7),
(1, 'frase',       NOW() - INTERVAL 5 MINUTE, 0, 1, 4),
(1, 'historia',    NOW() - INTERVAL 4 MINUTE, 1, 1, 10),
(1, 'vocabulario', NOW() - INTERVAL 3 MINUTE, 3, 3, 10);

INSERT INTO flor (id_crianca, id_atividade, tipo, data_plantio)
SELECT 1, a.id_atividade,
       ELT(1 + (a.id_atividade - 1) % 14, 'broto','muda','tulipa','rosa','azul','broto','amarela','muda','lilas','rosa','tulipa','azul','amarela','lilas'),
       a.data
FROM atividade a WHERE a.id_crianca = 1 ORDER BY a.id_atividade;

INSERT INTO crianca_conquista (id_crianca, id_conquista, data_desbloqueio) VALUES
(1, 'primeiro', NOW() - INTERVAL 12 DAY),
(1, 'florido', NOW() - INTERVAL 3 DAY);
