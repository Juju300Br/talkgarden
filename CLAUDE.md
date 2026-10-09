# TalkGarden – Plataforma Web de Apoio ao TDL

> Instruções para o Claude Code. Leia este arquivo inteiro antes de escrever qualquer código.

## 1. Sobre o projeto

O TalkGarden é o TCC do curso **Técnico em Informática do IFAM**, feito por um trio de estudantes.
É uma plataforma web educativa para **crianças com TDL (Transtorno do Desenvolvimento da Linguagem)**.
A criança joga minijogos de linguagem e, a cada atividade concluída, ganha moedas e uma nova flor
nasce no seu **jardim virtual**. O responsável (pai, mãe ou professor) faz o login e acompanha as estatísticas.

**Atores:**
- **Visitante**: ainda não tem conta e só pode se cadastrar.
- **Responsável**: faz login, edita o perfil e vê as estatísticas.
- **Criança**: joga, vê o jardim, as conquistas e as estatísticas (usa a conta do responsável).

## 2. Regras importantes (nível estudante!)

Este projeto é de **nível estudante iniciante**. O código precisa ser simples, para que as alunas
consigam entender, explicar para a banca e dar manutenção.

- **Linguagens permitidas:** HTML, CSS, JavaScript puro e PHP puro, com banco **MySQL**.
- **NÃO usar:** frameworks (React, Vue, Laravel, Bootstrap, Tailwind), npm, Composer, TypeScript, bibliotecas de gráfico.
- **Ambiente:** XAMPP (Apache + PHP + MySQL). O banco é criado pelo MySQL Workbench ou phpMyAdmin.
- **Comentários em português** explicando o que cada parte do código faz, de forma didática.
- Nomes de arquivos, variáveis, funções e tabelas em **português** e sem acento (ex.: `nome_crianca`, `salvarAtividade`).
- Prefira código repetido e claro a código "esperto" e abstrato. Nada de classes complexas nem padrões avançados.
- Mesmo sendo simples, faça o básico de segurança:
  - senhas com `password_hash()` e `password_verify()`;
  - consultas com **PDO e prepared statements** (nunca concatenar variáveis no SQL);
  - `htmlspecialchars()` ao exibir dados vindos do usuário;
  - todas as páginas internas verificam se existe uma sessão ativa (`$_SESSION`).

## 3. Como trabalhar comigo

- Trabalhe **uma etapa por vez** (seção 8). Ao terminar cada etapa, **pare**, explique em poucas linhas
  o que foi feito e como testar no navegador, e espere eu pedir a próxima.
- Ao final de cada etapa, sugira uma mensagem de commit curta para o Git.
- Se algo nos requisitos estiver confuso, pergunte antes de inventar.

## 4. Visual (protótipos)

As telas já foram desenhadas. As imagens estão na pasta **`prototipos/`**. **Abra e siga essas imagens**
ao montar o HTML/CSS de cada tela.

| Arquivo | Tela |
|---|---|
| `00-diagrama-caso-de-uso.png` | Diagrama de casos de uso (referência) |
| `01-login.png` / `02-login-erro.png` | Login / login com dados incorretos |
| `03-cadastro.png` | Cadastro |
| `04-recuperar-senha.png` / `05-email-enviado.png` / `06-nova-senha.png` | Recuperação de senha |
| `07-tela-inicial.png` | Tela inicial ("Olá, pequeno jardineiro!") |
| `08-jogo-vocabulario.png` | Jogo de Vocabulário |
| `09-recompensa.png` | Recompensa por atividade concluída |
| `10-jardim.png` | Jardim virtual |
| `11-conquista-desbloqueada.png` | Aviso de conquista desbloqueada |
| `12-estatisticas.png` | Estatísticas de desempenho |
| `13-conquistas.png` | Conquistas (medalhas) |
| `14-perfil.png` | Perfil e configurações |
| `15-sair.png` | Confirmação de saída |

O jogo **Formando Frases** não tem protótipo. Siga o mesmo estilo do Jogo de Vocabulário.

**Identidade visual:**
- Menu lateral roxo (degradê `#7B68C8` → `#5B4BA6`) com ícones: Início, Jardim, Estatísticas, Conquistas e Sair (embaixo).
- Topo claro com o logo "Talk" em roxo + "Garden" em verde, o saldo de moedas (amarelo), o avatar com o nome da criança e uma engrenagem.
- Cores: verde `#6BBF6B` (vocabulário/sucesso), rosa `#E9557A` (frases), roxo `#7B68C8` (botões principais), fundo céu azul-claro e grama verde-clara.
- Cantos bem arredondados, botões grandes, fonte arredondada e legível (ex.: **Nunito**, do Google Fonts).
- **Imagens:** crie todas as imagens você mesmo como **arquivos SVG** na pasta `img/`, no estilo flat
  (formas simples, cores chapadas, sem contorno pesado) igual aos protótipos. Desenhe:
  - `img/mascote/abelha.svg`: a abelhinha mascote (amarela com listras pretas, asas azul-claras, sorrindo);
  - `img/cenario/`: nuvem, árvore, cerca e grama, usados no fundo do login e da tela inicial;
  - `img/jardim/`: flores em estágios (semente → broto → muda → flor). Faça pelo menos 3 tipos de flor com cores diferentes;
  - `img/palavras/`: uma imagem por palavra do Jogo de Vocabulário (maca.svg, casa.svg, bola.svg…);
  - `img/frases/`: uma imagem de apoio para cada frase do Formando Frases;
  - `img/medalhas/`: um ícone para cada medalha, mais a versão bloqueada (cinza com cadeado).
  - Os SVGs precisam ser simples o bastante para que uma estudante consiga abrir o arquivo e entender/alterar as cores.
  - Os emojis (🍎 🏠 ⚽) só valem como plano B temporário, se alguma imagem ainda não estiver pronta.
- Público infantil: textos curtos, áreas de clique grandes, feedback de erro **gentil** ("Quase lá! Tente novamente."), nunca punitivo.
- Layout responsivo simples (funciona em computador e tablet).

## 5. Requisitos Funcionais

| ID | Nome | O que o sistema deve fazer | Prioridade |
|---|---|---|---|
| RF001 | Efetuar login | Login do responsável com e-mail e senha, com opção "Lembrar de mim". Se os dados estiverem errados, mostra a mensagem de erro (protótipo 02). | Essencial |
| RF002 | Cadastrar nova conta | Cadastro com nome do responsável, e-mail, nome da criança, senha e confirmação da senha. Não permite e-mail repetido. Depois do cadastro, vai para o login. | Essencial |
| RF003 | Jogar Jogo de Vocabulário | Mostra uma palavra (ex.: "MAÇÃ") e 3 opções de imagem. A criança toca na imagem certa. Cada rodada tem 5 palavras sorteadas. | Essencial |
| RF004 | Jogar Formando Frases | Mostra uma imagem de apoio e as palavras de uma frase embaralhadas. A criança toca nas palavras na ordem certa e clica em "Confirmar". Se errar, as palavras voltam para ela tentar de novo. Cada rodada tem 3 frases. | Essencial |
| RF005 | Fornecer feedback imediato | Após cada resposta, mostra acerto ou erro com cor, animação simples e som (se o som estiver ligado). | Essencial |
| RF006 | Conceder recompensas | Ao concluir uma rodada: soma moedas ao saldo do topo, planta 1 flor no jardim e mostra a tela de parabéns (protótipo 09). | Essencial |
| RF007 | Desbloquear conquistas | Depois de cada recompensa, verifica as metas e desbloqueia as medalhas atingidas, mostrando o aviso comemorativo (protótipo 11). | Essencial |
| RF008 | Visualizar jardim | Mostra as flores plantadas, os dias seguidos de uso e o % do jardim completo. Se o jardim estiver vazio, mostra uma mensagem incentivando a jogar. | Essencial |
| RF009 | Consultar estatísticas | Mostra o % de acertos no vocabulário, as frases montadas, os dias de prática e um gráfico de barras dos 7 dias da semana. Sem dados, mostra os indicadores zerados e "Ainda não há atividades registradas". | Essencial |
| RF010 | Visualizar conquistas | Lista as medalhas desbloqueadas (nome + descrição) e as bloqueadas (cadeado + "Ainda bloqueado"). Ao tocar numa bloqueada, mostra o que falta para desbloquear. | Essencial |
| RF011 | Manter perfil | O responsável vê e edita o nome dele, o nome da criança, o avatar (escolher entre 4 ou 5 avatares SVG de bichinhos), o e-mail e o som ligado/desligado. Valida os campos obrigatórios. | Essencial |
| RF012 | Sair do sistema | Botão "Sair" no menu lateral → tela de confirmação (protótipo 15) → encerra a sessão e volta ao login. | Essencial |
| RF013 | Recuperar senha | "Esqueceu a senha?" → informa o e-mail → cria uma nova senha e confirma. **Versão simplificada:** como o XAMPP não envia e-mail sem configurar SMTP, o sistema gera um token e **mostra o link de redefinição na tela** ("modo demonstração"). O link vale por 1 hora. | Desejável |

> O RF013 está no caso de uso UC001 (fluxo alternativo FA001), mas não tinha ID próprio na tabela de RFs.
> Ele deve ser adicionado ao documento do TCC.

### Regras de negócio (para o código ficar consistente)

- **Moedas:** 10 moedas por rodada concluída + 2 moedas por acerto **de primeira**.
- **Flores:** cada rodada concluída = 1 flor. Para o jardim completo são necessárias **20 flores**, então `% completo = flores / 20 * 100` (máximo 100%).
- **Dias seguidos:** quantidade de dias consecutivos, até hoje, em que existe pelo menos uma atividade.
- **% de acertos no vocabulário:** acertos de primeira ÷ total de palavras respondidas.
- Se a criança sair do jogo pelo botão "<" no meio da rodada, **nada é salvo**.
- **Medalhas iniciais:**

| Código | Nome | Meta |
|---|---|---|
| `primeiro_passo` | Primeiro passo | Concluir 1 atividade |
| `jardim_florido` | Jardim florido | Ter 5 flores plantadas |
| `sequencia_7` | Sequência de 7 dias | Jogar 7 dias seguidos |
| `mestre_frases` | Mestre das frases | Montar 10 frases corretamente |

## 6. Banco de dados (MySQL)

Nome do banco: `talkgarden`. Crie o script em `banco/banco.sql`, com `CREATE DATABASE`, as tabelas e o `INSERT` das medalhas.

```
responsaveis
  id (PK, auto_increment)
  nome, email (UNIQUE), senha (hash), nome_crianca
  avatar (nome do arquivo SVG, padrão 'abelha.svg'), som_ligado (TINYINT, padrão 1)
  moedas (INT, padrão 0), criado_em (DATETIME)

atividades                        -- cada rodada concluída = 1 linha = 1 flor
  id (PK), responsavel_id (FK → responsaveis)
  tipo ENUM('vocabulario','frases')
  total_itens, acertos_primeira, moedas_ganhas
  data_hora (DATETIME)

medalhas
  id (PK), codigo (UNIQUE), nome, descricao, requisito_texto, icone (nome do arquivo SVG em img/medalhas/)

medalhas_conquistadas
  id (PK), responsavel_id (FK), medalha_id (FK), data_conquista
  UNIQUE(responsavel_id, medalha_id)

recuperacao_senha
  id (PK), responsavel_id (FK), token, expira_em, usado (TINYINT)
```

As palavras do vocabulário e as frases ficam **num array no próprio JavaScript** (não precisam de tabela).
São no mínimo 12 palavras e 8 frases simples, cada uma com o caminho da sua imagem SVG.
Exemplo: `{ palavra: "MAÇÃ", imagem: "img/palavras/maca.svg" }` e `{ frase: "O gato bebe leite", imagem: "img/frases/gato-leite.svg" }`.

## 7. Estrutura de pastas

```
talkgarden/
├── CLAUDE.md
├── prototipos/            ← imagens das telas (já existem)
├── banco/banco.sql
├── includes/
│   ├── conexao.php        ← conexão PDO com o MySQL
│   ├── verifica_login.php ← redireciona para o login se não houver sessão
│   ├── topo.php           ← <head>, menu lateral e barra do topo (reutilizado nas páginas internas)
│   ├── rodape.php
│   └── funcoes.php        ← calcular dias seguidos, verificar medalhas etc.
├── api/
│   └── salvar_atividade.php ← recebe o resultado do jogo (fetch/JSON), salva, dá moedas, verifica medalhas e devolve JSON
├── img/                   ← imagens SVG criadas pelo Claude Code (mascote, cenário, jardim, palavras, frases, medalhas)
├── css/estilo.css
├── js/
│   ├── geral.js           ← som, modal de confirmação etc.
│   ├── vocabulario.js
│   └── frases.js
├── index.php              ← redireciona para inicio.php ou login.php
├── login.php  cadastro.php  recuperar_senha.php  nova_senha.php  sair.php
└── inicio.php  jogo_vocabulario.php  jogo_frases.php  jardim.php
    estatisticas.php  conquistas.php  perfil.php
```

**Como as partes conversam:**
- Formulários (login, cadastro, perfil, senha): `<form method="POST">` processado no topo do próprio arquivo PHP.
- Jogos: a lógica roda em JavaScript no navegador. No fim da rodada, o JS envia o resultado com `fetch()` para `api/salvar_atividade.php`, que responde com as moedas ganhas e as medalhas novas. O JS então mostra a tela de recompensa e, se for o caso, o aviso de conquista.
- Gráfico de estatísticas: barras feitas com `<div>`, com a altura em % calculada no PHP. Sem bibliotecas.

## 8. Etapas de desenvolvimento

0. **Imagens:** crie os SVGs da pasta `img/` (seção 4) e uma página `img/galeria.html` que mostre todas as imagens lado a lado, para eu revisar antes de seguir.
1. **Banco e conexão:** `banco/banco.sql`, `includes/conexao.php` e uma página de teste simples para verificar se a conexão funciona.
2. **Cadastro e login** (RF001, RF002): sessão, "Lembrar de mim" (cookie simples ou sessão mais longa), `verifica_login.php` e Sair com confirmação (RF012).
3. **Layout base:** `topo.php` com o menu lateral e a barra do topo, `estilo.css` e a tela inicial (`inicio.php`) igual ao protótipo 07.
4. **Jogo de Vocabulário** (RF003, RF005) + `api/salvar_atividade.php` + tela de recompensa (RF006).
5. **Formando Frases** (RF004), reaproveitando a mesma API e a tela de recompensa.
6. **Conquistas** (RF007, RF010): verificação das medalhas, aviso comemorativo e página de conquistas.
7. **Jardim e Estatísticas** (RF008, RF009).
8. **Perfil e configurações** (RF011), incluindo o som ligado/desligado respeitado nos jogos.
9. **Recuperar senha** (RF013, versão simplificada).
10. **Revisão final:** testar todos os fluxos (inclusive os de erro), revisar comentários e criar um `README.md` explicando como rodar o projeto no XAMPP.

## 9. Como rodar (para colocar no README)

1. Instalar o XAMPP e iniciar o **Apache** e o **MySQL**.
2. Copiar a pasta `talkgarden` para `C:\xampp\htdocs\`.
3. Rodar `banco/banco.sql` no MySQL Workbench ou phpMyAdmin.
4. Acessar `http://localhost/talkgarden` no navegador.
