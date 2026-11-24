# TalkGarden

Plataforma web de apoio ao desenvolvimento da linguagem em crianças com Transtorno do Desenvolvimento da Linguagem (TDL), de 6 a 9 anos.

Projeto do Curso Técnico de Nível Médio em Informática do IFAM – Campus Manaus Centro.
Autoras: Julliana Emelin de Sousa Andrade e Nicoli Silva de Lima.
Orientadora: Profa. Dra. Josiane Rodrigues Sandes.

## Como rodar no XAMPP

1. Instale o XAMPP (https://www.apachefriends.org) e abra o **XAMPP Control Panel**.
2. Clique em **Start** no **Apache** e no **MySQL**.
3. Copie a pasta `TalkGarden` inteira para `C:\xampp\htdocs\` e renomeie para `talkgarden`.
4. Abra http://localhost/phpmyadmin, clique em **Importar**, escolha o arquivo `banco/talkgarden.sql` e clique em **Importar** no fim da página. Isso cria o banco `talkgarden` com todas as tabelas.
5. Abra http://localhost/talkgarden no navegador.

Conta de demonstração: `demo@talkgarden.com` / senha `123456`.

Não abra o `index.html` com dois cliques: sem o Apache e o MySQL ligados, o sistema não consegue salvar nem ler os dados.

## Estrutura

- `index.html`: todas as telas do sistema
- `css/style.css`: visual
- `js/data.js` e `js/games-data.js`: palavras, frases, histórias, medalhas e outros dados dos jogos
- `js/app.js`: funcionamento das telas e dos jogos; a função `api()` envia e recebe os dados do PHP
- `api/`: arquivos PHP que gravam e leem os dados no MySQL (`conexao.php` faz a conexão com o banco)
- `banco/talkgarden.sql`: script que cria o banco de dados, as tabelas e a conta de demonstração
- `img/`: logo e fundos
- `docs/`: TCC, projeto integrador, manuais, diagramas e prints das telas
- `video/`: vídeo de demonstração e roteiro de dublagem

## Banco de dados

O banco `talkgarden` tem oito tabelas: `responsavel`, `configuracao`, `crianca`, `perfil_linguagem`, `atividade`, `flor`, `conquista` e `crianca_conquista`. A senha é guardada com `password_hash` do PHP. O modelo do banco no MySQL Workbench está em `banco/talkgarden.mwb` (abra no Workbench 8.0 em File > Open Model). Ele foi gerado a partir do `talkgarden.sql`, e a imagem do diagrama está em `docs/diagrama-banco-workbench.png`. Use o MySQL Workbench 8.0: a versão nova (26.x) não conecta no MariaDB do XAMPP.
