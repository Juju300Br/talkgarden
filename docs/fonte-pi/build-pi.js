// Gera o documento do Projeto Integrador (Grupo 6 – TalkGarden) nas normas ABNT
const fs = require('fs');
const path = require('path');
const D = require('docx');
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType,
  AlignmentType, Header, PageNumber, TabStopType, LineRuleType, ShadingType, BorderStyle,
  VerticalAlign, HeadingLevel, ExternalHyperlink,
} = D;

const DIR = __dirname;
const items = require('./items.json');
const pagesFile = path.join(DIR, 'pages.json');
const PAGES = fs.existsSync(pagesFile) ? JSON.parse(fs.readFileSync(pagesFile, 'utf8')) : {};
const OUT = process.argv[2] || path.join(DIR, 'out', 'PI.docx');

const FONT = 'Times New Roman';
const cm = v => Math.round(v * 567);
const TEXT_W = 9071; // 16 cm em twips
const L15 = { line: 360, lineRule: LineRuleType.AUTO };
const L1 = { line: 240, lineRule: LineRuleType.AUTO };

// ---------- auxiliares de texto ----------
function runs(arr, o = {}) {
  return arr.map(r => typeof r === 'string'
    ? new TextRun({ text: r, font: FONT, size: o.size || 24, bold: o.bold, italics: o.italics })
    : new TextRun({ text: r.t, font: FONT, size: o.size || 24, bold: r.b || o.bold, italics: r.i || o.italics }));
}
const P = (content, o = {}) => new Paragraph({
  alignment: o.align || AlignmentType.JUSTIFIED,
  spacing: { ...(o.single ? L1 : L15), before: o.before || 0, after: o.after ?? 0 },
  indent: o.noIndent ? undefined : { firstLine: o.firstLine ?? cm(1.25), left: o.left },
  pageBreakBefore: o.pageBreak,
  keepNext: o.keepNext,
  heading: o.heading,
  tabStops: o.tabStops,
  children: Array.isArray(content) ? runs(content, o) : runs([content], o),
});
const C = (t, o = {}) => P(t, { align: AlignmentType.CENTER, noIndent: true, ...o });
const blank = (n = 1, o = {}) => Array.from({ length: n }, () => P('', { noIndent: true, ...o }));

// ---------- registros para listas e sumário ----------
const toc = [], figs = [], tabs = [];
let nFig = 0, nTab = 0;

function H1(num, title, o = {}) {
  const label = num ? `${num} ${title}` : title;
  toc.push({ level: 1, label, num });
  return P([{ t: label, b: true }], {
    noIndent: true, heading: HeadingLevel.HEADING_1, pageBreak: true, keepNext: true,
    align: o.center ? AlignmentType.CENTER : AlignmentType.LEFT, after: 360,
  });
}
function H2(num, title) {
  const label = `${num} ${title}`;
  toc.push({ level: 2, label });
  return P([{ t: label, b: true }], { noIndent: true, heading: HeadingLevel.HEADING_2, keepNext: true, align: AlignmentType.LEFT, before: 360, after: 240 });
}

// legenda de figura (acima), imagem e fonte (abaixo)
function figure(file, title, fonte, opts = {}) {
  nFig++;
  const label = `Figura ${nFig} – ${title}`;
  figs.push(label);
  const buf = fs.readFileSync(file);
  const ext = path.extname(file).slice(1).toLowerCase().replace('jpeg', 'jpg');
  let w = opts.w, h = opts.h;
  const maxW = opts.maxW || 605, maxH = opts.maxH || 620;
  const k = Math.min(maxW / w, maxH / h, opts.scale || 1);
  w = Math.round(w * k); h = Math.round(h * k);
  return [
    C(label, { size: 20, single: true, keepNext: true, before: 240, after: 120 }),
    new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { ...L1, after: 120 },
      children: [new ImageRun({ type: ext === 'jpg' ? 'jpg' : 'png', data: buf, transformation: { width: w, height: h } })] }),
    C(fonte, { size: 20, single: true, after: 240 }),
  ];
}
const media = f => path.join(DIR, 'src', 'word', f);
const emu = x => x / 9525;

// ---------- tabelas ----------
const border = { style: BorderStyle.SINGLE, size: 4, color: '000000' };
const borders = { top: border, bottom: border, left: border, right: border };
function cellParas(c, o) {
  return c.paras.filter((p, i) => p.text.trim() || i === 0).map(p => new Paragraph({
    alignment: o.center ? AlignmentType.CENTER : AlignmentType.LEFT,
    spacing: { ...L1, before: 40, after: 40 },
    children: runs(p.runs.length ? p.runs.map(r => ({ ...r, t: r.t.replace(/\s+$/, '') })) : [''], { size: 20, bold: o.bold }),
  }));
}
function rebuildTable(t, widths, o = {}) {
  const total = widths.reduce((a, b) => a + b, 0);
  const W = widths.map(w => Math.round(w * TEXT_W / total));
  return new Table({
    width: { size: TEXT_W, type: WidthType.DXA },
    columnWidths: W,
    rows: t.rows.map((r, ri) => {
      let pos = 0;
      return new TableRow({
        cantSplit: r.length > 1 && ri === 0,
        tableHeader: ri === 0,
        children: r.map((c, ci) => {
          const span = c.span || 1;
          const w = W.slice(pos, pos + span).reduce((a, b) => a + b, 0); pos += span;
          const head = ri === 0 || (o.firstColBold && ci === 0);
          return new TableCell({
            columnSpan: span > 1 ? span : undefined,
            width: { size: w, type: WidthType.DXA }, borders,
            verticalAlign: VerticalAlign.CENTER,
            shading: ri === 0 ? { fill: 'D9D9D9', type: ShadingType.CLEAR, color: 'auto' } : undefined,
            margins: { top: 40, bottom: 40, left: 100, right: 100 },
            children: cellParas(c, { bold: head, center: (ri === 0) || (o.centerCols || []).includes(ci) }),
          });
        }),
      });
    }),
  });
}
function tableBlock(title, tableObj, fonte = 'Fonte: elaborado pelas autoras.') {
  nTab++;
  const label = `Tabela ${nTab} – ${title}`;
  tabs.push(label);
  return [C(label, { size: 20, single: true, keepNext: true, before: 240, after: 120 }), tableObj, C(fonte, { size: 20, single: true, before: 80, after: 240 })];
}

// ---------- conversão dos parágrafos do documento original ----------
function fixText(t) {
  return t
    .replace('(Ministério da Saúde, 2021)', '(BRASIL, 2021)')
    .replace('Segundo Silva e Carvalho,', 'Segundo Silva e Carvalho ([20--]),')

    .replace(/\s*\(referenciar\)\s*$/, '');
}
function bodyFrom(i, extra = {}) {
  const x = items[i];
  let rs = x.runs.map(r => ({ ...r }));
  // texto corrigido mantendo negrito/itálico: se houver correção, aplica no run que contém o trecho
  rs = rs.map(r => ({ ...r, t: fixText(r.t) }));
  if (rs.length) { rs[0].t = rs[0].t.replace(/^\s+/, ''); rs[rs.length - 1].t = rs[rs.length - 1].t.replace(/\s+$/, ''); }
  if (i === 165) rs[rs.length - 1].t = rs[rs.length - 1].t.replace(/inclusão educacional\.$/, 'inclusão educacional (SILVA; CARVALHO, [20--]).');
  return P(rs, extra);
}
const range = (a, b) => { const r = []; for (let i = a; i <= b; i++) r.push(i); return r; };
const isText = i => items[i].kind === 'p' && items[i].text.trim() && !items[i].imgs.length && !items[i].style;
const paras = (a, b) => range(a, b).filter(isText).map(i => bodyFrom(i));

// ---------- CAPA ----------
const logo = fs.readFileSync(media('media/image16.png'));
const capa = [
  new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 240 }, children: [new ImageRun({ type: 'png', data: logo, transformation: { width: 210, height: 64 } })] }),
  C([{ t: 'INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO AMAZONAS', b: true }], { single: true }),
  C([{ t: 'CAMPUS MANAUS CENTRO', b: true }], { single: true }),
  C([{ t: 'DEPARTAMENTO ACADÊMICO DE INFORMAÇÃO E COMUNICAÇÃO', b: true }], { single: true }),
  C([{ t: 'CURSO TÉCNICO DE NÍVEL MÉDIO EM INFORMÁTICA', b: true }], { single: true }),
  ...blank(4),
  C([{ t: 'DEBORAH GABRIELY MORAES MARTINS', b: true }]),
  C([{ t: 'JULLIANA EMELIN DE SOUSA ANDRADE', b: true }]),
  C([{ t: 'NICOLI SILVA DE LIMA', b: true }]),
  ...blank(5),
  C([{ t: 'TALKGARDEN: PLATAFORMA WEB DE APOIO AO DESENVOLVIMENTO DA LINGUAGEM EM CRIANÇAS COM TDL', b: true }]),
  C('Projeto Integrador', { before: 120 }),
  ...blank(9),
  C([{ t: 'MANAUS – AM', b: true }], { single: true }),
  C([{ t: '2026', b: true }], { single: true }),
];

// ---------- FOLHA DE ROSTO ----------
const rosto = [
  C([{ t: 'DEBORAH GABRIELY MORAES MARTINS', b: true }], { pageBreak: true }),
  C([{ t: 'JULLIANA EMELIN DE SOUSA ANDRADE', b: true }]),
  C([{ t: 'NICOLI SILVA DE LIMA', b: true }]),
  ...blank(8),
  C([{ t: 'TALKGARDEN: PLATAFORMA WEB DE APOIO AO DESENVOLVIMENTO DA LINGUAGEM EM CRIANÇAS COM TDL', b: true }]),
  ...blank(3),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { left: cm(8) }, spacing: { ...L1, after: 240 }, children: runs([
    'Projeto Integrador apresentado ao Curso Técnico de Nível Médio em Informática do Instituto Federal de Educação, Ciência e Tecnologia do Amazonas – Campus Manaus Centro, como requisito parcial para aprovação no componente Projeto Integrador.'], { size: 22 }) }),
  new Paragraph({ alignment: AlignmentType.JUSTIFIED, indent: { left: cm(8) }, spacing: L1, children: runs([{ t: 'Orientadora: ', b: true }, 'Profa. Dra. Josiane Rodrigues Sandes.'], { size: 22 }) }),
  ...blank(10),
  C([{ t: 'MANAUS – AM', b: true }], { single: true }),
  C([{ t: '2026', b: true }], { single: true }),
];

// ---------- RESUMO / ABSTRACT ----------
const RESUMO = 'O Transtorno do Desenvolvimento da Linguagem (TDL) afeta a compreensão e a expressão da linguagem de cerca de 7% das crianças e, muitas vezes, não é identificado a tempo. No Brasil, a dificuldade de acesso a acompanhamento fonoaudiológico agrava esse quadro, sobretudo entre famílias de baixa renda. Diante disso, este Projeto Integrador apresenta o TalkGarden, uma plataforma web educativa e gratuita que apoia a alfabetização e o desenvolvimento da linguagem de crianças com TDL por meio de minijogos de vocabulário e de formação de frases, com um sistema de recompensas representado por um jardim virtual. O trabalho seguiu uma pesquisa aplicada, de abordagem qualitativa, organizada em levantamento de requisitos, modelagem do sistema com os diagramas de casos de uso e de classes da UML, criação de protótipos de interface e projeto do banco de dados relacional. Como resultados, foram definidos doze requisitos funcionais, dez casos de uso descritos, o diagrama de classes, quinze telas prototipadas e o modelo lógico do banco de dados com oito tabelas. Conclui-se que a proposta é viável como recurso complementar ao trabalho de pais, professores e fonoaudiólogos, sem substituir o atendimento especializado.';
const ABSTRACT = 'Developmental Language Disorder (DLD) affects the comprehension and expression of language in about 7% of children and is often not identified in time. In Brazil, limited access to speech-language therapy makes this situation worse, especially for low-income families. This Integrative Project presents TalkGarden, a free educational web platform that supports literacy and language development in children with DLD through vocabulary and sentence-building mini-games, with a reward system represented by a virtual garden. The work followed an applied, qualitative research approach, organized into requirements gathering, system modeling with UML use case and class diagrams, interface prototyping and relational database design. As results, twelve functional requirements, ten described use cases, a class diagram, fifteen prototyped screens and a logical database model with eight tables were defined. The proposal is considered feasible as a complementary resource for parents, teachers and speech-language therapists, without replacing specialized care.';
const resumo = [
  C([{ t: 'RESUMO', b: true }], { pageBreak: true, after: 360 }),
  P(RESUMO, { single: true, noIndent: true }),
  P([{ t: 'Palavras-chave: ', b: true }, 'transtorno do desenvolvimento da linguagem; alfabetização; plataforma web; jogos educativos.'], { single: true, noIndent: true, before: 240 }),
];
const abstract = [
  C([{ t: 'ABSTRACT', b: true }], { pageBreak: true, after: 360 }),
  P(ABSTRACT, { single: true, noIndent: true }),
  P([{ t: 'Keywords: ', b: true }, 'developmental language disorder; literacy; web platform; educational games.'], { single: true, noIndent: true, before: 240 }),
];

// ---------- TEXTO ----------
const body = [];
const add = (...x) => body.push(...x.flat());

// 1 INTRODUÇÃO
add(H1('1', 'INTRODUÇÃO'), paras(115, 118));
add(H2('1.1', 'Justificativa'), paras(120, 122));

// 2 OBJETIVOS
add(H1('2', 'OBJETIVOS'));
add(H2('2.1', 'Objetivo geral'), paras(131, 131));
add(H2('2.2', 'Objetivos específicos'));
range(133, 136).forEach((i, k) => {
  let t = items[i].text.trim().replace(/[;.]$/, '');
  t = t.charAt(0).toLowerCase() + t.slice(1);
  add(P(`${'abcd'[k]}) ${t}${k === 3 ? '.' : ';'}`, { firstLine: 0, left: cm(1.25) }));
});

// 3 METODOLOGIA
add(H1('3', 'METODOLOGIA'), paras(150, 152));

// 4 FUNDAMENTAÇÃO TEÓRICA
add(H1('4', 'FUNDAMENTAÇÃO TEÓRICA'));
add(H2('4.1', 'Transtorno do Desenvolvimento da Linguagem'), paras(164, 166));
add(H2('4.2', 'Linguagem e processo de alfabetização'), paras(168, 170));
add(H2('4.3', 'Tecnologias educacionais e jogos digitais como ferramentas de aprendizagem'), paras(172, 174));
add(figure(media('media/image20.png'), 'Telas iniciais do jogo “O Livro do Conhecimento”', 'Fonte: Pires et al. (2020).', { w: emu(5399730), h: emu(1397000) }));
items[178].runs.forEach(r => { r.b = false; }); add(bodyFrom(178), paras(180, 180));
add(figure(media('media/image13.png'), 'Exemplo do desafio da primeira fase do jogo “O Livro do Conhecimento”', 'Fonte: Pires et al. (2020).', { w: emu(5399730), h: emu(1892300) }));
add(paras(184, 186));

// 5 TECNOLOGIAS
add(H1('5', 'TECNOLOGIAS E FERRAMENTAS UTILIZADAS'), paras(190, 190));
const logoFig = (img, title, fonte, cx, cy) => figure(media(img), title, fonte, { w: emu(cx), h: emu(cy), maxW: 190, maxH: 120 });
const techs = [
  ['5.1', 'StarUML', 193, ['media/image10.png', 'Logotipo do StarUML', 'Fonte: https://hl4rny.tistory.com/446.', 1258252, 1258252]],
  ['5.2', 'Canva', 199, ['media/image2.jpg', 'Logotipo do Canva', 'Fonte: https://share.google/7uqZawDvaeazDs1Ef.', 1810702, 1358027]],
  ['5.3', 'GitHub', 205, ['media/image5.png', 'Logotipos do Git e do GitHub', 'Fonte: https://share.google/UqzAzzdz7uWiaetOY.', 2115502, 1196353]],
  ['5.4', 'Trello', 211, ['media/image19.jpg', 'Logotipo do Trello', 'Fonte: https://share.google/NdRl8fLnvpDNnMrOe.', 2105977, 1185113]],
  ['5.5', 'Google Docs', 218, ['media/image9.jpg', 'Logotipo do Google Docs', 'Fonte: Google.', 1477327, 1477327]],
  ['5.6', 'Visual Studio Code (VS Code)', 223, ['media/image21.jpg', 'Logotipo do Visual Studio Code', 'Fonte: https://share.google/gZZMB465kh4FlOo2n.', 1334452, 1334452]],
  ['5.7', 'MySQL Workbench', 229, ['media/image28.png', 'Logotipo do MySQL Workbench', 'Fonte: https://share.google/gsek4eyr0WOBoxwat.', 772478, 772478]],
];
for (const [n, name, pi, f] of techs) {
  add(H2(n, name), bodyFrom(pi));
  if (name === 'Trello') add(P('O quadro de tarefas do grupo pode ser consultado em: https://trello.com/invite/b/gH1ktAzE/ATTI93ff75e66443fe1f2d068dbb2b67a82c390CD0D3/talkgarden-pi.'));
  add(logoFig(...f));
}
add(H2('5.8', 'HTML, CSS e JavaScript'), bodyFrom(235));
add(logoFig('media/image17.png', 'Logotipo do HTML', 'Fonte: https://encrypted-tbn0.gstatic.com/images?q=tbn.', 1574963, 1574963));
add(logoFig('media/image24.jpg', 'Logotipo do CSS', 'Fonte: https://www.google.com/imgres?q=logo%20CSS.', 1927388, 1454632));
add(logoFig('media/image25.png', 'Logotipo do JavaScript', 'Fonte: https://www.google.com/imgres?q=logo%20javascript.', 1886267, 1886267));

// 6 PRODUTO
add(H1('6', 'PRODUTO'), paras(270, 270));
add(H2('6.1', 'Requisitos funcionais'), paras(272, 272));
add(tableBlock('Requisitos funcionais', rebuildTable(items[274], [1635, 2220, 5220], { centerCols: [0] })));
add(H2('6.2', 'Diagrama de casos de uso'), paras(277, 277));
add(figure(media('media/image30.png'), 'Diagrama de casos de uso da plataforma TalkGarden', 'Fonte: elaborado pelas autoras.', { w: emu(5760000), h: emu(4114286) }));
add(paras(282, 284));
add(H2('6.3', 'Descrição dos casos de uso'), paras(286, 286));
for (let i = 288; i <= 315; i += 3) {
  const head = items[i].rows[0][0].paras.map(p => p.text).join(' ').trim(); // "UC001 – EFETUAR LOGIN"
  const name = head.split('–')[1].trim().toLowerCase();
  const nice = name.charAt(0).toUpperCase() + name.slice(1);
  add(tableBlock(`Descrição do caso de uso “${nice}”`, rebuildTable(items[i], [2041, 7030], { firstColBold: true })));
}

// 6.4 DIAGRAMA DE CLASSES (novo)
add(H2('6.4', 'Diagrama de classes'));
add(P('O diagrama de classes da UML mostra a estrutura estática do sistema: as classes, seus atributos e métodos e a forma como elas se relacionam. Ele foi elaborado a partir dos casos de uso descritos na seção anterior e serve de guia tanto para a programação quanto para o projeto do banco de dados. A Figura 14 apresenta o diagrama de classes da plataforma TalkGarden.'));
add(figure(path.join(DIR, 'classes-staruml.png'), 'Diagrama de classes da plataforma TalkGarden', 'Fonte: elaborado pelas autoras.', { w: 3200, h: 3552, maxH: 640 }));
add(P('A classe Responsavel reúne as operações de acesso, como cadastrar, efetuar login, recuperar e redefinir a senha, manter o perfil e sair, que correspondem aos casos de uso UC001, UC002, UC008 e UC010. Cada responsável possui uma Configuracao, com as opções de som, música, leitura em voz alta e letras grandes, e consulta a Estatistica de desempenho, que é gerada a partir das atividades realizadas pela criança.'));
add(P('A classe Crianca é o centro do diagrama. Ela realiza atividades, cultiva um Jardim, que contém as flores plantadas, e desbloqueia conquistas. A classe Atividade é abstrata, ou seja, não é usada diretamente: ela define o que todo jogo tem em comum, como data, acertos, erros e os métodos iniciar, verificar a resposta, exibir o retorno e concluir. Os dois jogos da plataforma, JogoVocabulario e FormandoFrases, herdam essas características e acrescentam apenas o que é próprio de cada um, usando, respectivamente, as classes Palavra e Frase. Ao ser concluída, a atividade gera uma Recompensa em moedas, que permite plantar uma nova flor no jardim.'));

// 6.5 BANCO DE DADOS (novo)
add(H2('6.5', 'Projeto do banco de dados'));
add(P('O banco de dados da plataforma foi modelado no formato relacional, para ser implementado no MySQL. A modelagem partiu dos requisitos funcionais, dos casos de uso e do diagrama de classes: cada informação que o sistema precisa guardar, como a conta do responsável, o perfil da criança, o resultado das atividades e as recompensas conquistadas, deu origem a uma tabela. A modelagem foi feita no MySQL Workbench, que gerou o diagrama entidade-relacionamento (EER) apresentado na Figura 15. Nesse diagrama, a notação conhecida como pé de galinha indica o lado “muitos” de cada relacionamento.'));
add(figure('C:/Users/julli/Documents/TalkGarden/docs/diagrama-banco-workbench.png', 'Modelo lógico do banco de dados da plataforma TalkGarden', 'Fonte: elaborado pelas autoras no MySQL Workbench.', { w: 1792, h: 1780, maxH: 350 }));
add(P('A tabela responsavel guarda os dados de acesso de quem cria a conta. A senha é armazenada apenas na forma de hash, nunca em texto puro. Cada responsável possui uma configuracao (relação um para um), com as opções de som, música, leitura em voz alta e letras grandes da tela de perfil, e uma criança cadastrada na tabela crianca, que concentra o nome, a idade, o avatar escolhido e as moedas acumuladas. As respostas do questionário inicial ficam na tabela perfil_linguagem.'));
add(P('Cada atividade concluída é registrada na tabela atividade, com o tipo de jogo, a data, o número de acertos de primeira, o total de perguntas e as moedas ganhas. O campo tipo já aceita, além do vocabulário e da formação de frases, os jogos de comandos e de narrativa previstos para as próximas versões. São esses registros que alimentam a tela de estatísticas consultada pelo responsável (UC008): o percentual de acertos e os dias de prática são calculados a partir deles por meio de consultas SQL.'));
add(P('As recompensas também ficam no banco. Cada flor plantada no jardim virtual é um registro da tabela flor, ligado à atividade que a gerou. As conquistas disponíveis ficam na tabela conquista, e as que cada criança já desbloqueou são registradas em crianca_conquista, com a data do desbloqueio, atendendo aos casos de uso UC005, UC006, UC007 e UC009.'));
add(P('Nesta versão do protótipo, os dados ainda ficam salvos no próprio navegador, por meio do recurso localStorage, em uma estrutura que segue as mesmas informações do modelo. A implementação do banco no MySQL, com uma camada no servidor para ligá-lo à interface, é a próxima etapa do projeto.'));

// 6.6 PROTÓTIPOS
add(H2('6.6', 'Protótipos de interface'));
add(P('As Figuras 16 a 30 apresentam os protótipos das telas da plataforma, elaborados no Canva antes do início da programação. Eles mostram o fluxo de acesso do responsável, os jogos, as recompensas e as telas de acompanhamento.'));
const proto = [
  ['media/image26.png', 'Tela de login', 4715828, 2186920],
  ['media/image6.png', 'Tela de login com dados incorretos', 4772978, 2200044],
  ['media/image22.png', 'Tela de cadastro', 4425655, 2019205],
  ['media/image4.png', 'Tela de recuperação de senha', 2467713, 1884435],
  ['media/image11.png', 'Tela de confirmação de envio do e-mail de recuperação', 2298711, 2057717],
  ['media/image3.png', 'Tela de criação de nova senha', 2439353, 2035783],
  ['media/image15.png', 'Tela inicial', 4546437, 2076767],
  ['media/image18.png', 'Tela do jogo de vocabulário', 4611053, 2108713],
  ['media/image23.png', 'Tela de recompensa por atividade concluída', 4525328, 2075106],
  ['media/image14.png', 'Tela do jardim virtual', 4868228, 2237001],
  ['media/image1.png', 'Tela de conquista desbloqueada', 4868228, 2231271],
  ['media/image7.png', 'Tela de estatísticas de desempenho', 5399730, 2463800],
  ['media/image12.png', 'Tela de conquistas', 5399730, 2476500],
  ['media/image27.png', 'Tela de perfil e configurações', 5053920, 2324417],
  ['media/image8.png', 'Tela de confirmação de saída', 3125153, 2230190],
];
for (const [img, t, cx, cy] of proto) add(figure(media(img), t, 'Fonte: elaborado pelas autoras.', { w: emu(cx), h: emu(cy), maxH: 330 }));

// 7 CRONOGRAMA
add(H1('7', 'CRONOGRAMA'));
add(P('A Tabela 12 apresenta a distribuição das etapas do projeto entre os meses de maio e novembro de 2026.'));
const MESES = ['Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov'];
const ETAPAS = [
  ['Levantamento de requisitos:', ' revisão bibliográfica e definição das necessidades do público com TDL', [0, 1]],
  ['Modelagem do sistema (UML):', ' diagramas de casos de uso e de classes', [1, 2]],
  ['Criação dos protótipos:', ' desenho das interfaces, com foco em acessibilidade e usabilidade', [2, 3]],
  ['Projeto do banco de dados:', ' modelo lógico e estruturação das tabelas', [3, 4]],
  ['Desenvolvimento:', ' codificação em HTML, CSS e JavaScript e integração com o banco de dados', [4, 5, 6]],
  ['Escrita e entrega final:', ' redação do documento e preparação para a apresentação', [5, 6]],
];
const cel = (r) => ({ span: 1, paras: [{ runs: r, text: r.map(x => x.t).join('') }] });
const crono = { rows: [
  [cel([{ t: 'Atividade' }]), ...MESES.map(m => cel([{ t: m }]))],
  ...ETAPAS.map(([a, b, ms]) => [cel([{ t: a, b: true }, { t: b }]), ...MESES.map((_, k) => cel([{ t: ms.includes(k) ? 'X' : '' }]))]),
] };
add(tableBlock('Cronograma de execução do projeto', rebuildTable(crono, [4171, 700, 700, 700, 700, 700, 700, 700], { centerCols: [1, 2, 3, 4, 5, 6, 7] })));

// 8 CONCLUSÃO (nova)
add(H1('8', 'CONCLUSÃO'));
add(P('Este Projeto Integrador teve como objetivo desenvolver a proposta de uma plataforma web educativa de apoio à alfabetização e ao desenvolvimento da linguagem de crianças com Transtorno do Desenvolvimento da Linguagem. Partiu-se de um problema concreto: o TDL é frequente, costuma ser identificado tarde e, no Brasil, o acesso ao acompanhamento fonoaudiológico ainda é desigual, o que deixa muitas crianças sem estímulo adequado justamente na fase em que aprendem a ler e a escrever.'));
add(P('Os objetivos específicos foram atendidos ao longo do trabalho. O levantamento de requisitos resultou em doze requisitos funcionais, que foram organizados em um diagrama de casos de uso e detalhados em dez descrições de casos de uso, e a estrutura do sistema foi representada no diagrama de classes. Os protótipos de interface definiram a identidade visual do TalkGarden e um fluxo de navegação simples, pensado para o público infantil, com imagens grandes, leitura em voz alta e recompensas visuais. Por fim, o projeto do banco de dados organizou em oito tabelas as informações necessárias para guardar com segurança a conta do responsável, o progresso da criança e as conquistas obtidas.'));
add(P('A pesquisa bibliográfica mostrou que jogos digitais com desafios progressivos e retorno imediato, como o estudado por Pires et al. (2020), aumentam a motivação e a atenção das crianças. O TalkGarden aplica esses princípios ao público com TDL, concentrando as atividades em vocabulário e formação de frases, e permite que o responsável acompanhe o desempenho pela tela de estatísticas. Cabe destacar que a plataforma é um recurso complementar: ela não realiza diagnóstico e não substitui o trabalho de fonoaudiólogos e professores.'));
add(P('Como trabalhos futuros, propõe-se implementar o banco de dados no MySQL, conforme o modelo apresentado, ampliar o conjunto de jogos com atividades de compreensão de comandos e de narrativa, e realizar testes de usabilidade com crianças, responsáveis e profissionais da área, a fim de avaliar se a plataforma de fato contribui para o desenvolvimento da linguagem do público a que se destina.'));

// REFERÊNCIAS (sem número, centralizado)
const REFS = [
  ['AMERICAN SPEECH-LANGUAGE-HEARING ASSOCIATION (ASHA). ', { t: 'Spoken language disorders', b: true }, '. Rockville, MD: ASHA, 2023. Disponível em: https://www.asha.org/practice-portal/clinical-topics/spoken-language-disorders/. Acesso em: 17 jun. 2026.'],
  ['BRASIL. Ministério da Saúde. ', { t: 'Política Nacional de Atenção Integral à Saúde da Criança', b: true }, '. Brasília: Ministério da Saúde, 2021.'],
  ['INSTITUTO BRASILEIRO DE GEOGRAFIA E ESTATÍSTICA (IBGE). ', { t: 'Síntese de indicadores sociais', b: true }, ': uma análise das condições de vida da população brasileira. Rio de Janeiro: IBGE, 2022.'],
  ['MENEZES, Maria Luiza Nogueira; MORSCH, Denise Salles; MAYRINK, Maria Carolina dos Santos. Transtornos da linguagem na pré-escola e o início da alfabetização. ', { t: 'Revista Psicopedagogia', b: true }, ', São Paulo, v. 40, n. 122, p. 181-190, 2023.'],
  ['NATIONAL INSTITUTE ON DEAFNESS AND OTHER COMMUNICATION DISORDERS (NIDCD). ', { t: 'Quick statistics about voice, speech, language', b: true }, '. Bethesda: NIDCD, 2023. Disponível em: https://www.nidcd.nih.gov/health/statistics/quick-statistics-voice-speech-language. Acesso em: 17 jun. 2026.'],
  ['PIRES, Douglas ', { t: 'et al', i: true }, '. O Livro do Conhecimento: um ', { t: 'serious game', i: true }, ' educacional para aprendizagem de ortografia da Língua Portuguesa. ', { t: 'Revista Brasileira de Informática na Educação', b: true }, ', v. 28, p. 434-458, 2020.'],
  ['RAISING AWARENESS OF DEVELOPMENTAL LANGUAGE DISORDER (RADLD). ', { t: 'What is DLD?', b: true }, ' [', { t: 'S. l.', i: true }, ']: RADLD, 2022. Disponível em: https://radld.org. Acesso em: 17 jun. 2026.'],
  ['SILVA, Priscila Cristiane Escobar; CARVALHO, Rosana Passos Quitério de. Transtorno do Desenvolvimento de Linguagem: desafios e possibilidades no processo de ensino-aprendizagem na educação infantil. ', { t: 'Revista Caleidoscópio', b: true }, ', v. 16, n. 1, p. 65-73, [20--].'],
];
add(H1('', 'REFERÊNCIAS', { center: true }));
REFS.forEach(r => add(P(r, { single: true, noIndent: true, align: AlignmentType.LEFT, after: 240 })));

// ANEXO A
add(H1('', 'ANEXO A – TERMO DE ANUÊNCIA', { center: true }));
const anexo = [
  [{ t: 'CURSO: ', b: true }, 'Técnico de Nível Médio em Informática'],
  [{ t: 'TÍTULO DO PROJETO: ', b: true }, 'TalkGarden: plataforma web de apoio ao desenvolvimento da linguagem em crianças com TDL'],
  [{ t: 'MODALIDADE: ', b: true }, '(   ) Solo     (   ) Dupla     ( X ) Trio'],
  [{ t: 'PROFESSORA RESPONSÁVEL: ', b: true }, 'Profa. Dra. Josiane Rodrigues Sandes'],
  [{ t: 'DISCENTES: ', b: true }, 'Deborah Gabriely Moraes Martins, Julliana Emelin de Sousa Andrade e Nicoli Silva de Lima'],
  [{ t: 'MATRÍCULAS: ', b: true }, '________________, ________________ e ________________'],
  [{ t: 'INÍCIO: ', b: true }, '_____ de ____________________ de 2026'],
  [{ t: 'HORÁRIO: ', b: true }, '____h____ às ____h____'],
];
anexo.forEach(r => add(P(r, { noIndent: true, align: AlignmentType.LEFT, after: 120 })));
add(...blank(2));
add(C('Manaus, _____ de ____________________ de 2026.'));
add(...blank(3));
const sig = (...nomes) => new Table({
  width: { size: TEXT_W, type: WidthType.DXA }, columnWidths: nomes.map(() => Math.floor(TEXT_W / nomes.length)),
  borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE }, insideHorizontal: { style: BorderStyle.NONE }, insideVertical: { style: BorderStyle.NONE } },
  rows: [new TableRow({ children: nomes.map(t => new TableCell({
    width: { size: Math.floor(TEXT_W / nomes.length), type: WidthType.DXA },
    borders: { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } },
    margins: { left: 120, right: 120 },
    children: [C('_______________________', { single: true }), C(t, { single: true, size: 20 })],
  })) })],
});
add(sig('Deborah Gabriely Moraes Martins', 'Julliana Emelin de Sousa Andrade', 'Nicoli Silva de Lima'));
add(...blank(2));
add(C('_______________________________', { single: true }), C('Profa. Dra. Josiane Rodrigues Sandes', { single: true, size: 22 }), C('Orientadora', { single: true, size: 22 }));

// ---------- LISTAS E SUMÁRIO (páginas vindas da renderização anterior) ----------
const pg = k => (PAGES[k] != null ? String(PAGES[k]) : '00');
const leaderLine = (text, page, o = {}) => new Paragraph({
  alignment: AlignmentType.LEFT,
  spacing: { ...(o.spacing || L15), after: o.after || 0 },
  indent: o.hanging ? { left: o.hanging, hanging: o.hanging } : undefined,
  tabStops: [{ type: TabStopType.RIGHT, position: TEXT_W, leader: 'dot' }],
  children: runs([{ t: text, b: o.bold }, '\t', { t: page, b: o.bold }]),
});
const listaFig = [C([{ t: 'LISTA DE FIGURAS', b: true }], { pageBreak: true, after: 360 }),
  ...figs.map(f => leaderLine(f, pg(f), { hanging: cm(2.1), after: 100, spacing: L1 }))];
const listaTab = [C([{ t: 'LISTA DE TABELAS', b: true }], { pageBreak: true, after: 360 }),
  ...tabs.map(t => leaderLine(t, pg(t), { hanging: cm(2.3), after: 100, spacing: L1 }))];
const sumario = [C([{ t: 'SUMÁRIO', b: true }], { pageBreak: true, after: 360 }),
  ...toc.map(e => leaderLine(e.label, pg(e.label), { bold: e.level === 1, after: 0 }))];

// ---------- DOCUMENTO ----------
const margins = { top: cm(3), left: cm(3), bottom: cm(2), right: cm(2), header: cm(2), footer: cm(1.25) };
const pageSize = { width: 11906, height: 16838 };
const header = new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: 20 })] })] });

const doc = new Document({
  creator: 'Deborah Gabriely Moraes Martins; Julliana Emelin de Sousa Andrade; Nicoli Silva de Lima',
  title: 'TalkGarden – Projeto Integrador',
  styles: {
    default: { document: { run: { font: FONT, size: 24 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, color: '000000' }, paragraph: { outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: FONT, size: 24, bold: true, color: '000000' }, paragraph: { outlineLevel: 1 } },
    ],
  },
  sections: [
    { properties: { page: { size: pageSize, margin: margins } }, children: capa },
    { properties: { page: { size: pageSize, margin: margins, pageNumbers: { start: 1 } } }, children: [...rosto, ...resumo, ...abstract, ...listaFig, ...listaTab, ...sumario] },
    { properties: { page: { size: pageSize, margin: margins } }, headers: { default: header }, children: body },
  ],
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(path.join(DIR, 'targets.json'), JSON.stringify({ toc: toc.map(e => e.label), figs, tabs }, null, 1));
Packer.toBuffer(doc).then(b => { fs.writeFileSync(OUT, b); console.log('ok', OUT, 'figs', figs.length, 'tabs', tabs.length); });
