# TalkGarden

Plataforma web de apoio ao desenvolvimento da linguagem em crianças com Transtorno do Desenvolvimento da Linguagem (TDL), de 6 a 9 anos.

Projeto do Curso Técnico de Nível Médio em Informática do IFAM – Campus Manaus Centro.
Autoras: Julliana Emelin de Sousa Andrade e Nicoli Silva de Lima.
Orientadora: Profa. Dra. Josiane Rodrigues Sandes.

## Como abrir

Basta abrir o arquivo `index.html` no navegador. Não precisa instalar nada.

Conta de demonstração: `demo@talkgarden.com` / senha `123456`.

## Estrutura

- `index.html`: todas as telas do sistema
- `css/style.css`: visual
- `js/data.js` e `js/games-data.js`: palavras, frases, histórias, medalhas e outros dados dos jogos
- `js/app.js`: funcionamento do sistema
- `img/`: logo e fundos
- `docs/`: PCCT (Projeto de Conclusão de Curso Técnico), projeto integrador, manuais, diagramas e prints das telas
- `video/`: vídeo de demonstração e roteiro de dublagem

Os dados ficam salvos no próprio navegador (localStorage), simulando o banco de dados MySQL modelado em `docs/`.

## Versão com banco de dados (para o futuro)

A ligação com um banco MySQL de verdade já foi feita e está guardada na branch `php-mysql` deste repositório: ela tem o script do banco (`banco/talkgarden.sql`), o modelo do MySQL Workbench (`banco/talkgarden.mwb`) e os arquivos PHP da pasta `api/`, e roda no XAMPP. A versão principal (`main`) continua salvando os dados no navegador.
