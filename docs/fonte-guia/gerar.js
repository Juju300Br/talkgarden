// Gera docs/Guia-do-Codigo-e-Resumo-TalkGarden.pdf a partir do código atual.
// Uso: node gerar.js   (precisa do Google Chrome e do pdftotext instalados)
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const RAIZ = path.resolve(__dirname, '..', '..');
const SAIDA = path.join(RAIZ, 'docs', 'Guia-do-Codigo-e-Resumo-TalkGarden.pdf');
const HTML = path.join(__dirname, 'guia.html');
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PAG = path.join(__dirname, 'paginas.json');
const paginas = fs.existsSync(PAG) ? JSON.parse(fs.readFileSync(PAG, 'utf8')) : {};

const ler = f => fs.readFileSync(path.join(RAIZ, f), 'utf8').replace(/\r/g, '').split('\n');
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function linhaDe(arq, re) {
  const L = ler(arq); const i = L.findIndex(l => re.test(l));
  if (i < 0) throw new Error(`não achei ${re} em ${arq}`);
  return i + 1;
}
// trecho de código: da linha que casa com "inicio" até fechar as chaves (ou até "fim")
function trecho(arq, inicio, fim) {
  const L = ler(arq);
  const a = L.findIndex(l => inicio.test(l));
  if (a < 0) throw new Error(`não achei ${inicio} em ${arq}`);
  let b = a;
  if (fim instanceof RegExp) { b = L.findIndex((l, i) => i > a && fim.test(l)); }
  else if (typeof fim === 'number') { b = a + fim - 1; }
  else {
    let prof = 0, abriu = false;
    for (let i = a; i < L.length; i++) {
      for (const c of L[i].replace(/'[^']*'|"[^"]*"|`[^`]*`/g, '')) { if (c === '{') { prof++; abriu = true; } if (c === '}') prof--; }
      if (abriu && prof <= 0) { b = i; break; }
    }
  }
  const linhas = L.slice(a, b + 1).map((l, k) => `<span class="n">${a + 1 + k}</span>${esc(l) || ' '}`).join('\n');
  return `<figure class="cod"><figcaption>${arq}, linhas ${a + 1} a ${b + 1}</figcaption><pre>${linhas}</pre></figure>`;
}

// sumário
const titulos = [];
let nSec = 0, nSub = 0;
const h1 = t => { nSec++; nSub = 0; const r = `${nSec} ${t}`; titulos.push({ t: r, n: 1 }); return `<h1>${r}</h1>`; };
const h2 = t => { nSub++; const r = `${nSec}.${nSub} ${t}`; titulos.push({ t: r, n: 2 }); return `<h2>${r}</h2>`; };

const app = 'js/app.js';
const L = (re, arq = app) => linhaDe(arq, re);

const corpo = `
${h1('Resumo do projeto')}
<p>O TalkGarden é uma plataforma web gratuita que apoia o desenvolvimento da linguagem de crianças de 6 a 9 anos com Transtorno do Desenvolvimento da Linguagem (TDL). O TDL afeta cerca de 7% das crianças: elas têm dificuldade para compreender e usar a linguagem, mesmo sem deficiência intelectual ou auditiva. No Brasil, muitas famílias não conseguem acompanhamento fonoaudiológico, e a plataforma oferece um apoio complementar para praticar em casa ou na escola.</p>
<p>A criança joga quatro minijogos, um para cada habilidade que costuma ser afetada pelo TDL:</p>
<table class="simples">
<tr><th>Jogo</th><th>O que a criança faz</th><th>Habilidade trabalhada</th></tr>
<tr><td>Jogo de Vocabulário</td><td>Ouve uma palavra e toca na imagem certa</td><td>Vocabulário</td></tr>
<tr><td>Formando Frases</td><td>Toca nas palavras na ordem certa para montar a frase</td><td>Construção de frases</td></tr>
<tr><td>Siga a Abelha</td><td>Escuta um comando e toca na figura pedida</td><td>Compreensão de instruções</td></tr>
<tr><td>Conte a História</td><td>Ouve uma história, ordena as cenas e responde sobre ela</td><td>Narrativa</td></tr>
</table>
<p>Cada jogo concluído dá moedas e planta uma flor no jardim virtual da criança, e algumas metas desbloqueiam medalhas. O responsável (pai, mãe ou professor) cria a conta, responde a um questionário inicial que orienta a família sem fazer diagnóstico e acompanha o desempenho na tela de estatísticas.</p>
<p>A interface foi feita com HTML, CSS e JavaScript. Nesta versão, os dados ficam salvos no próprio navegador, com o recurso <code>localStorage</code>, simulando o banco de dados que foi modelado para o MySQL e que será implementado na próxima etapa.</p>

${h1('Como o projeto está organizado')}
<table class="simples">
<tr><th>Arquivo ou pasta</th><th>Para que serve</th></tr>
<tr><td>index.html</td><td>Todas as telas do sistema, uma embaixo da outra; só a tela ativa aparece</td></tr>
<tr><td>css/style.css</td><td>Cores, fontes, tamanhos e posição de tudo na tela</td></tr>
<tr><td>js/data.js</td><td>Dados fixos: palavras e imagens do vocabulário, frases, flores, avatares e medalhas</td></tr>
<tr><td>js/games-data.js</td><td>Dados do Siga a Abelha e do Conte a História, os sinais do questionário e os limites de idade</td></tr>
<tr><td>js/app.js</td><td>O funcionamento: navegação entre telas, login, jogos, recompensas, estatísticas e perfil</td></tr>
<tr><td>img/</td><td>Logo e imagens de fundo</td></tr>
</table>
<p>Os três arquivos JavaScript são carregados no fim do <code>index.html</code>, nesta ordem, porque o <code>app.js</code> usa os dados que os outros dois criam:</p>
${trecho('index.html', /<script src="js\/data.js">/, 3)}

${h2('Como rodar')}
<p>Basta abrir o arquivo <code>index.html</code> no navegador; não é preciso instalar nada. A conta de demonstração é demo@talkgarden.com, com a senha 123456.</p>

${h1('Onde os dados ficam guardados')}
<p>O sistema ainda não usa um servidor. Tudo o que precisa ser lembrado (as contas, o progresso das crianças, as flores, as medalhas e as configurações) fica guardado no <code>localStorage</code>, um espaço que todo navegador oferece para o site salvar dados no próprio computador. Esses dados ficam num único objeto, <code>db</code>, salvo com o nome <code>talkgarden_db</code>. A função <code>loadDB</code> lê esse objeto quando a página abre, e <code>saveDB</code> grava de volta a cada mudança:</p>
${trecho(app, /^function loadDB/, /^function saveUser/)}
<p>Cada conta é criada pela função <code>newUser</code>, que já define tudo o que o sistema guarda de uma família. Esses campos são os mesmos que aparecem nas tabelas do banco modelado:</p>
${trecho(app, /^function newUser/)}
<p>A senha nunca é guardada como foi digitada. A função <code>hashPass</code> transforma a senha num código SHA-256 (hash), e é esse código que fica salvo. No login, o sistema gera o hash da senha digitada e compara com o guardado:</p>
${trecho(app, /^async function hashPass/)}
<p>A função <code>handleLogin</code> (linha ${L(/^async function handleLogin/)}) faz essa comparação. Se estiver certo, guarda quem entrou com <code>setSession</code> (no <code>localStorage</code> se "Lembrar de mim" estiver marcado, ou só até fechar o navegador) e abre o sistema com <code>enterApp</code>:</p>
${trecho(app, /^async function handleLogin/)}

${h1('As telas: index.html')}
<p>O sistema é uma página só (single page application). Todas as telas estão no <code>index.html</code>, cada uma dentro de uma <code>&lt;section class="view"&gt;</code> com um id próprio, como <code>view-home</code>, <code>view-vocab</code> e <code>view-stats</code>. No CSS, toda <code>.view</code> fica escondida, e só a que tem a classe <code>active</code> aparece:</p>
${trecho('css/style.css', /^\.view\{/, 2)}
<p>Os botões que trocam de tela não têm código próprio. Eles só dizem para onde levam, com o atributo <code>data-view</code> ou <code>data-view-link</code>:</p>
${trecho('index.html', /data-view="home"/, 4)}
<p>A tela do Jogo de Vocabulário mostra como as telas são montadas. Os lugares que mudam a cada rodada, como a palavra e as imagens, têm um id para o JavaScript preencher:</p>
${trecho('index.html', /id="view-vocab"/, /<\/section>/)}

${h1('O visual: style.css')}
<p>As cores da identidade visual ficam em variáveis no começo do arquivo. Assim, o roxo principal é escrito uma vez só (<code>--purple-700</code>) e reaproveitado no resto do CSS com <code>var(--purple-700)</code>. Se a cor mudar, basta trocar aqui.</p>
${trecho('css/style.css', /^:root\{/, 7)}
<p>O resto do arquivo está organizado na mesma ordem das telas: telas de acesso, menu lateral e topo, tela inicial, jogos, jardim, estatísticas, conquistas, perfil e janelas de aviso. As imagens de fundo (o céu com árvores e a abelha da tela inicial) são arquivos SVG da pasta <code>img</code>, usados como fundo pelo CSS, sem animação.</p>

${h1('Os dados dos jogos: data.js e games-data.js')}
<p>As palavras, frases e histórias não ficam no banco: elas são o conteúdo fixo dos jogos e estão em listas do JavaScript. Para incluir uma palavra nova no Jogo de Vocabulário, basta acrescentar uma linha na lista <code>WORDS</code>:</p>
${trecho('js/data.js', /^const WORDS = \[/, /^\];/)}
<p>As medalhas ficam na lista <code>BADGES</code>. Cada uma tem uma função <code>test</code> que recebe os dados da criança e responde se a meta foi alcançada:</p>
${trecho('js/data.js', /^const BADGES = \[/, 5)}
<p>O <code>games-data.js</code> segue a mesma ideia para os outros jogos: <code>CORES</code> e <code>OBJETOS</code> montam os comandos do Siga a Abelha, <code>HISTORIAS</code> guarda as histórias com suas cenas, e <code>SINAIS</code> traz os sinais de alerta usados no questionário.</p>

${h1('O funcionamento: app.js')}
${h2('Navegação entre telas')}
<p>A função <code>showView</code> esconde todas as telas, mostra a pedida e chama a função que prepara aquela tela. Por exemplo, abrir a tela <code>vocab</code> chama <code>startVocab</code>, que sorteia as palavras da rodada.</p>
${trecho(app, /^function showView\(/)}
${h2('Delegação de cliques')}
<p>Em vez de colocar um evento em cada botão, o sistema usa um único "escutador" de cliques no documento inteiro. Quando alguém clica, ele usa <code>closest</code> para descobrir que tipo de elemento foi clicado e chama a função certa. Isso funciona até para botões criados depois, como as imagens de cada rodada.</p>
${trecho(app, /document\.addEventListener\('click'/, 15)}
${h2('Jogo de Vocabulário')}
<p>O estado do jogo fica no objeto <code>vocab</code> (linha ${L(/^const vocab = /)}): a fila de palavras, a posição atual e quantas foram acertadas de primeira. A função <code>renderVocabWord</code> escolhe duas imagens erradas, embaralha com a certa e desenha os botões:</p>
${trecho(app, /^function renderVocabWord\(/)}
<p>Quando a criança toca numa imagem, <code>onVocabTile</code> compara a imagem com a palavra. Se acertar, mostra o elogio e passa para a próxima; se errar, marca a imagem e incentiva a tentar de novo. Na última palavra, chama <code>finishVocab</code>, que calcula as moedas e chama a recompensa.</p>
${trecho(app, /^function onVocabTile\(/)}
${h2('Os outros jogos')}
<p>Os outros três jogos seguem o mesmo modelo, com um objeto de estado e funções de início, desenho, verificação e fim:</p>
<table class="simples">
<tr><th>Jogo</th><th>Funções principais</th></tr>
<tr><td>Formando Frases</td><td><code>startPhrase</code> (linha ${L(/^function startPhrase/)}), <code>renderPhrase</code>, <code>checkPhrase</code></td></tr>
<tr><td>Siga a Abelha</td><td><code>genCommand</code> (linha ${L(/^function genCommand/)}), <code>startCommands</code>, <code>onCmdTile</code>, <code>finishCommands</code></td></tr>
<tr><td>Conte a História</td><td><code>startStory</code> (linha ${L(/^function startStory/)}), <code>checkStory</code>, <code>showStoryQuestion</code>, <code>onStoryOption</code></td></tr>
</table>
<p>No Siga a Abelha, a função <code>genCommand</code> monta comandos de quatro tipos: cor ("toque no carro azul"), tamanho, posição ("o gato que está embaixo da mesa") e duas etapas ("toque primeiro na flor e depois na bola").</p>
${h2('Recompensa e gravação dos dados')}
<p>Todos os jogos terminam na mesma função, <code>grantReward</code>. Ela soma as moedas, planta a próxima flor, registra a atividade do dia, confere se alguma medalha foi desbloqueada e salva tudo com <code>saveUser()</code>. Depois abre a janela de parabéns.</p>
${trecho(app, /^function grantReward\(/, /sfx\.win\(\);/)}
${h2('Questionário e aviso de acompanhamento')}
<p>No primeiro acesso, o responsável responde ao questionário "Conhecendo a criança". A função <code>orientacao</code> (linha ${L(/^function orientacao/)}) escolhe a mensagem conforme as respostas, sem nunca dizer que a criança tem TDL. Na tela de estatísticas, <code>renderAlert</code> (linha ${L(/^function renderAlert/)}) só mostra um aviso depois de pelo menos ${'12'} respostas com menos de 60% de acertos de primeira.</p>
${h2('Jardim, estatísticas e perfil')}
<p><code>renderGarden</code> desenha uma flor para cada atividade concluída e calcula quanto falta para completar o jardim. <code>renderStats</code> mostra os percentuais de acerto e o gráfico da semana. Na tela de perfil, <code>saveProfile</code> atualiza os dados da conta, e cada chave de configuração é salva na hora.</p>

${h1('O banco de dados planejado')}
<p>O banco de dados foi modelado no MySQL Workbench e será implementado na próxima etapa do projeto. O modelo tem oito tabelas e segue as mesmas informações que hoje ficam no <code>localStorage</code>. As linhas com pé de galinha marcam o lado "muitos" de cada relacionamento.</p>
<img class="diagrama" src="../diagrama-banco-workbench.png" alt="">
<table class="simples">
<tr><th>Tabela</th><th>O que guarda</th></tr>
<tr><td>responsavel</td><td>Nome, e-mail e hash da senha de quem cria a conta</td></tr>
<tr><td>configuracao</td><td>Som, música, leitura em voz alta e letras grandes (uma por responsável)</td></tr>
<tr><td>crianca</td><td>Nome, idade, avatar e moedas da criança</td></tr>
<tr><td>perfil_linguagem</td><td>Respostas do questionário "Conhecendo a criança"</td></tr>
<tr><td>atividade</td><td>Cada jogo concluído: tipo, data, acertos, total e moedas</td></tr>
<tr><td>flor</td><td>Cada flor do jardim, ligada à atividade que a gerou</td></tr>
<tr><td>conquista</td><td>As oito medalhas que existem no sistema</td></tr>
<tr><td>crianca_conquista</td><td>Quais medalhas cada criança já ganhou e quando</td></tr>
</table>


${h1('Perguntas que a banca pode fazer')}
<dl>
<dt>Por que os dados ficam no navegador?</dt><dd>Nesta etapa, o foco foi construir e testar as telas e os jogos. O <code>localStorage</code> permite guardar os dados sem precisar de servidor, e o sistema abre só com o <code>index.html</code>. A estrutura dos dados já segue o banco modelado, para facilitar a troca pelo MySQL depois.</dd>
<dt>Qual a limitação disso?</dt><dd>Os dados ficam só naquele navegador e naquele computador. Se a família entrar de outro aparelho, a conta não aparece. Por isso a implementação do MySQL é a próxima etapa.</dd>
<dt>Onde fica a senha?</dt><dd>Só o hash SHA-256 da senha é guardado, gerado pela função <code>hashPass</code>. No login, o sistema gera o hash da senha digitada e compara com o guardado.</dd>
<dt>Como as estatísticas são calculadas?</dt><dd>A cada jogo, o sistema soma os acertos de primeira e o total de perguntas daquele jogo, e conta quantas atividades foram feitas em cada dia. A tela de estatísticas calcula os percentuais a partir desses números.</dd>
<dt>Para que serve a tabela crianca_conquista?</dt><dd>É uma tabela associativa: resolve a relação de muitos para muitos entre crianças e medalhas, porque uma criança ganha várias medalhas e cada medalha pode ser ganha por várias crianças. A chave primária dela é formada pelas duas chaves estrangeiras juntas.</dd>
<dt>Como vocês usaram o MySQL Workbench?</dt><dd>Para modelar o banco de dados: o Workbench gerou o diagrama EER com as oito tabelas e seus relacionamentos, que será a base da implementação no MySQL.</dd>
<dt>Onde ficam as palavras e as frases dos jogos?</dt><dd>No <code>data.js</code> e no <code>games-data.js</code>. São conteúdo fixo, que não muda por usuário, então não precisam estar no banco.</dd>
<dt>O sistema diagnostica TDL?</dt><dd>Não. O questionário só orienta a família, e o aviso das estatísticas só sugere conversar com a escola ou com um fonoaudiólogo. Somente um fonoaudiólogo pode diagnosticar.</dd>
<dt>Como o sistema lembra quem está logado?</dt><dd>Pela função <code>setSession</code>, que guarda o e-mail de quem entrou. Ao abrir a página, a função <code>init</code> confere se há alguém salvo e, se houver, abre direto na tela inicial.</dd>
</dl>
`;

const sumario = titulos.map(x => `<div class="s${x.n}"><span>${x.t}</span><i></i><b>${paginas[x.t] || '00'}</b></div>`).join('');
const logo = fs.readFileSync(path.join(RAIZ, 'img', 'logo.svg'), 'utf8');

const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Guia do Código – TalkGarden</title><style>
@page{size:A4;margin:22mm 20mm 22mm 22mm;@bottom-right{content:counter(page);font:9pt 'Segoe UI';color:#7A7590}}
@page capa{@bottom-right{content:none}}
body{font:10.5pt/1.6 'Segoe UI',sans-serif;color:#2E2A3F;margin:0}
.capa{page:capa;height:250mm;display:flex;flex-direction:column;justify-content:center}
.capa svg{width:110px;height:110px}
.capa h1{font-size:34pt;line-height:1.1;margin:22px 0 10px;color:#2E2A3F;break-before:auto}
.capa .t{color:#7C6FCB}.capa .g{color:#4C9A50}
.capa p{font-size:13pt;color:#5d5874;margin:0 0 4px}
.capa .rodape{margin-top:auto;font-size:10.5pt;color:#5d5874}
.sumario{break-before:page}
.sumario h2{font-size:18pt;color:#5B4FA8;margin:0 0 18px}
.sumario div{display:flex;align-items:baseline;gap:6px;margin:5px 0}
.sumario .s1{font-weight:600;margin-top:12px}.sumario .s2{padding-left:18px}
.sumario i{flex:1;border-bottom:1px dotted #B9B3D3;transform:translateY(-3px)}
h1{font-size:20pt;color:#5B4FA8;margin:0 0 14px;break-before:page;break-after:avoid}
h2{font-size:13pt;color:#2E2A3F;margin:22px 0 8px;break-after:avoid}
p{margin:0 0 10px;text-align:justify}
code{font:9pt Consolas,monospace;background:#F3F1FB;padding:1px 4px;border-radius:3px}
figure.cod{margin:10px 0 16px;break-inside:avoid}
figure.cod figcaption{font-size:8.5pt;color:#7A7590;margin-bottom:3px}
pre{font:8.4pt/1.45 Consolas,monospace;background:#F7F6FC;border-left:3px solid #7C6FCB;padding:8px 10px;margin:0;white-space:pre-wrap;word-break:break-word}
pre .n{display:inline-block;width:30px;color:#A7A2BD;user-select:none}
table.simples{width:100%;border-collapse:collapse;margin:8px 0 16px;font-size:9.8pt;break-inside:avoid}
table.simples th{text-align:left;border-bottom:1.5px solid #5B4FA8;padding:5px 8px;color:#5B4FA8}
table.simples td{border-bottom:1px solid #E4E1F0;padding:3px 8px;vertical-align:top}
svg.fluxo{width:100%;margin:6px 0 14px}
img.diagrama{width:56%;display:block;margin:6px auto 10px}
ol{margin:0 0 10px;padding-left:20px}
dl dt{font-weight:600;margin-top:12px;break-after:avoid}
dl dd{margin:3px 0 0;text-align:justify}
</style></head><body>
<section class="capa">
${logo.replace('<svg', '<svg class="logo"')}
<h1>Guia do código<br><span class="t">Talk</span><span class="g">Garden</span></h1>
<p>Como o sistema funciona, arquivo por arquivo, e um resumo do projeto</p>
<div class="rodape">Julliana Emelin de Sousa Andrade e Nicoli Silva de Lima<br>Orientadora: Profa. Dra. Josiane Rodrigues Sandes<br>IFAM – Campus Manaus Centro · 2026</div>
</section>
<section class="sumario"><h2>Sumário</h2>${sumario}</section>
${corpo}
</body></html>`;
fs.writeFileSync(HTML, html);
const tmp = path.join(__dirname, 'guia.pdf');
execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer', `--print-to-pdf=${tmp}`, 'file:///' + HTML.replace(/\\/g, '/')], { stdio: 'ignore' });
const txt = execFileSync('pdftotext', ['-enc', 'UTF-8', tmp, '-'], { encoding: 'utf8' }).split('\f');
const novo = {};
let desde = txt.findIndex(p => p.includes('Sumário')) + 1;
for (const x of titulos) {
  const i = txt.findIndex((p, k) => k >= desde && p.split('\n').some(l => l.trim() === x.t));
  if (i >= 0) { novo[x.t] = i + 1; desde = i; }
}
fs.writeFileSync(PAG, JSON.stringify(novo, null, 1));
const mudou = JSON.stringify(novo) !== JSON.stringify(paginas);
if (!mudou) fs.copyFileSync(tmp, SAIDA);
console.log(mudou ? 'páginas mudaram: rode de novo' : 'pronto: ' + SAIDA, Object.keys(novo).length + '/' + titulos.length, 'títulos', txt.length - 1, 'páginas');
