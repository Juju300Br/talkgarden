// Roteiro de fala da apresentação do PI (7 min de fala + 3 min de vídeo)
const fs = require('fs');
const path = require('path');
const D = require(process.argv[2]);
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = D;

const SLIDES = [
  ['1', 'Título e equipe', 'Deborah', '0:00 – 0:30',
    'Bom dia a todos. Nós somos a Deborah Gabriely, a Julliana Emelin e a Nicoli Silva, do Grupo 6, e vamos apresentar o TalkGarden, uma plataforma web de apoio ao desenvolvimento da linguagem em crianças com TDL, o Transtorno do Desenvolvimento da Linguagem. Nossa orientadora é a professora Jorlene.'],
  ['2', 'Objetivos', 'Deborah', '0:30 – 1:20',
    'O TDL atinge cerca de sete por cento das crianças: elas têm dificuldade para entender e usar a linguagem, mesmo sem nenhum problema auditivo ou intelectual. E muitas famílias não conseguem acompanhamento com um fonoaudiólogo. Por isso, o nosso objetivo geral foi desenvolver um sistema web educativo que apoie a alfabetização e a linguagem dessas crianças, com atividades lúdicas focadas em vocabulário e construção de frases. Os objetivos específicos foram: levantar os requisitos e modelar o sistema com a UML, criar protótipos pensados para crianças, construir a plataforma com HTML, CSS e JavaScript e modelar o banco de dados.'],
  ['3', 'Metodologia', 'Deborah', '1:20 – 2:10',
    'Fizemos uma pesquisa aplicada, de abordagem qualitativa, em três etapas. Primeiro, o levantamento: pesquisamos sobre o TDL, sobre alfabetização e sobre jogos educativos, e a partir disso definimos os requisitos. Depois, o planejamento: fizemos os diagramas da UML e desenhamos os protótipos das telas no Canva, antes de programar. Por último, o desenvolvimento: codificamos a plataforma e modelamos o banco de dados que vai guardar o progresso das crianças.'],
  ['4', 'Tecnologias utilizadas', 'Deborah', '2:10 – 3:00',
    'Para a modelagem usamos o StarUML, e para os protótipos, o Canva. O site foi programado no Visual Studio Code, com HTML para a estrutura, CSS para o visual e JavaScript para os jogos e a interação. O banco de dados foi modelado no MySQL Workbench. Para organizar o trabalho, usamos o Trello para dividir as tarefas, o GitHub para guardar e versionar o código e o Google Docs para escrever a documentação juntas.'],
  ['5', 'Diagrama de classes', 'Julliana', '3:00 – 4:00',
    'O diagrama de classes mostra como o sistema está organizado por dentro. A classe Responsavel é quem cria a conta, faz login e consulta as estatísticas. Ela tem uma Configuracao, com som, música, leitura em voz alta e letras grandes. A classe central é a Crianca: ela realiza atividades, cultiva um Jardim, ganha flores e desbloqueia conquistas. A classe Atividade é abstrata, ou seja, reúne o que todo jogo tem em comum, como acertos e erros. Os dois jogos, JogoVocabulario e FormandoFrases, herdam dela e usam, respectivamente, as classes Palavra e Frase. Ao terminar um jogo, a Atividade gera uma Recompensa em moedas, que planta uma flor no jardim.'],
  ['6', 'Diagrama de casos de uso', 'Julliana', '4:00 – 5:00',
    'No diagrama de casos de uso temos três atores. O Visitante só pode se cadastrar; depois do cadastro, ele vira Responsável. O Responsável efetua login, mantém o perfil e consulta as estatísticas da criança. A Criança, que é o ator principal, joga o Jogo de Vocabulário e o Formando Frases, visualiza o jardim e as conquistas. Os dois jogos têm um relacionamento include com Ganhar recompensas, porque toda atividade concluída sempre dá moedas e uma flor. Já Desbloquear conquista é um extend, porque só acontece quando a criança atinge uma meta.'],
  ['7', 'MER', 'Nicoli', '5:00 – 5:50',
    'O modelo entidade-relacionamento foi feito no MySQL Workbench e tem oito tabelas. O responsavel tem uma configuracao, numa relação de um para um, e uma crianca. As respostas do questionário inicial ficam em perfil_linguagem. Cada jogo concluído vira um registro na tabela atividade, e cada flor do jardim fica na tabela flor. Como uma criança pode ganhar várias medalhas, e cada medalha pode ser ganha por várias crianças, usamos a tabela associativa crianca_conquista. As estatísticas não ficam numa tabela própria: elas são calculadas a partir das atividades. Nesta versão, os dados ainda ficam salvos no navegador, seguindo esse mesmo modelo, e a ligação com o MySQL é a próxima etapa.'],
  ['8', 'Conclusão', 'Nicoli', '5:50 – 6:40',
    'Com este projeto, cumprimos os objetivos: levantamos os requisitos, modelamos o sistema, desenhamos as telas e construímos uma plataforma que funciona, com dois jogos, moedas, medalhas, um jardim que cresce e estatísticas para a família. É importante dizer que o TalkGarden não faz diagnóstico e não substitui o fonoaudiólogo: ele é um apoio para praticar em casa e na escola. Como próximos passos, queremos implementar o banco no MySQL, colocar o site na internet, criar novos jogos e testar a plataforma com crianças e fonoaudiólogos.'],
  ['9', 'Referências', 'Nicoli', '6:40 – 7:00',
    'Estas são as referências que usamos, entre elas a associação americana de fonoaudiologia, a ASHA, o Ministério da Saúde, o IBGE e o estudo de Pires e colaboradores sobre jogos educativos. Agora vamos mostrar o TalkGarden funcionando.'],
  ['—', 'Apresentação do site funcional', 'Vídeo', '7:00 – 10:00',
    '(Vídeo de 3 minutos.) Ao final, se sobrar tempo: “Obrigada pela atenção! Estamos abertas a perguntas.”'],
];

const F = 'Calibri';
const run = (t, o = {}) => new TextRun({ text: t, font: F, size: o.size || 22, bold: o.bold, color: o.color, italics: o.italics });
const par = (kids, after = 100) => new Paragraph({ spacing: { after, line: 300 }, children: kids });
const linha = { style: BorderStyle.SINGLE, size: 4, color: 'D5D0E8' }, nada = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const cor = { Deborah: 'C2477A', Nicoli: '4C9A50', Julliana: '5B4FA8', 'Vídeo': '6B6789' };

const blocos = [];
for (const [n, titulo, quem, tempo, fala] of SLIDES) {
  blocos.push(new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: [9026], rows: [new TableRow({ cantSplit: true, children: [new TableCell({
    width: { size: 9026, type: WidthType.DXA }, borders: { top: linha, bottom: nada, left: nada, right: nada }, margins: { top: 140, bottom: 160, left: 0, right: 0 },
    children: [
      par([run(n === '—' ? titulo : `${n}. ${titulo}`, { bold: true, size: 26, color: '2E2A3F' }), run('   ' + tempo, { color: '6B6789', size: 21 }), run('   ' + quem, { bold: true, color: cor[quem], size: 21 })], 80),
      par([run(fala)], 0),
    ] })] })] }));
}

const doc = new Document({ sections: [{
  properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, bottom: 1200, left: 1440, right: 1440 } } },
  children: [
    par([run('Roteiro da apresentação do Projeto Integrador', { size: 34, bold: true, color: '2E2A3F' })], 60),
    par([run('TalkGarden · Grupo 6 · 10 minutos: 7 de fala e 3 de vídeo', { size: 23, color: '5D5874' })], 220),
    par([run('Cada fala foi escrita para caber no tempo indicado, lendo em ritmo calmo (cerca de 130 palavras por minuto). Não precisa decorar palavra por palavra: o importante é passar pelas ideias de cada slide.')], 240),
    ...blocos,
  ] }] });
Packer.toBuffer(doc).then(b => { const out = path.join(__dirname, '..', '..', 'docs', process.env.SAIDA || 'Roteiro da apresentacao - PI.docx'); fs.writeFileSync(out, b); console.log('ok', out);
  for (const s of SLIDES) console.log(s[0], s[2], s[4].split(/\s+/).length, 'palavras'); });
