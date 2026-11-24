// Roteiro de dublagem do comercial do PI (Word)
// Uso: node roteiro-docx.js <caminho do pacote docx>
const fs = require('fs');
const path = require('path');
const D = require(process.argv[2]);
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = D;

const FALAS = [
  ['0:00 – 0:03', 'Jardim sem cor, a Ju parada', 'Narração', 'Essa é a Ju.'],
  ['0:03 – 0:09', 'A Ju tenta falar e as palavras saem embaralhadas', 'Ju', '(devagar, confusa) Sofá… gato… o… no… dorme?'],
  ['0:09 – 0:12', 'As palavras caem no chão', 'Narração', 'Às vezes, as palavras não querem ficar no lugar.'],
  ['0:12 – 0:23', 'A turma de crianças, com duas em destaque', 'Narração', 'Isso acontece com cerca de sete em cada cem crianças. É o TDL, o Transtorno do Desenvolvimento da Linguagem. E muitas famílias não conseguem acompanhamento com um fonoaudiólogo.'],
  ['0:23 – 0:29', 'A abelha chega voando', 'Narração', 'Mas espera aí… que zumbido é esse?'],
  ['0:29 – 0:34', 'O jardim ganha cor e as flores nascem', 'Narração', 'Chegou a abelhinha do TalkGarden!'],
  ['0:34 – 0:37', 'Balão “Oi, Ju!”', 'Abelha', 'Oi, Ju! Vamos brincar com as palavras?'],
  ['0:37 – 0:44', 'O tablet aparece e a câmera entra na tela', 'Ju e Narração', 'Ju: Vamos! — Narração: O TalkGarden é uma plataforma web gratuita que ajuda crianças com TDL a desenvolver a linguagem brincando.'],
  ['0:44 – 0:52', 'Tela de login', 'Narração', 'Primeiro, o responsável entra com o e-mail e a senha.'],
  ['0:52 – 0:56', 'Tela inicial', 'Abelha', 'Aqui ficam o seu jardim e os jogos!'],
  ['0:56 – 1:00', 'Jogo de Vocabulário', 'Narração', 'No Jogo de Vocabulário, a Ju ouve a palavra e toca na imagem certa.'],
  ['1:00 – 1:04', 'A Ju erra a primeira', 'Abelha', 'Quase lá! Tenta de novo!'],
  ['1:04 – 1:12', 'Acertos seguidos', 'Ju', 'Gato! … Pato!'],
  ['1:12 – 1:16', 'Janela de parabéns', 'Abelha', 'Parabéns! Uma flor nova no seu jardim!'],
  ['1:16 – 1:28', 'Formando Frases', 'Narração', 'No Formando Frases, ela toca nas palavras na ordem certa para montar a frase.'],
  ['1:28 – 1:36', 'Parabéns e a medalha “Mestre das frases”', 'Abelha', 'Uau! Você ganhou a medalha Mestre das frases!'],
  ['1:36 – 1:44', 'Conquistas e jardim', 'Narração', 'Cada atividade vira moedas, medalhas e flores no jardim.'],
  ['1:44 – 1:52', 'Estatísticas', 'Narração', 'E o responsável acompanha o progresso da criança pelas estatísticas.'],
  ['1:52 – 1:58', 'A câmera sai da tela e volta ao jardim florido', 'Narração', 'E assim, de flor em flor…'],
  ['1:58 – 2:03', 'A Ju fala a frase inteira', 'Ju', '(clara e orgulhosa) O gato dorme no sofá!'],
  ['2:05 – 2:09', 'Balão “Muito bem!”', 'Abelha', 'Muito bem, Ju!'],
  ['2:10 – 2:19', 'Logo do TalkGarden', 'Narração', 'TalkGarden: aprender brincando, uma flor de cada vez.'],
];

const F = 'Calibri';
const run = (t, o = {}) => new TextRun({ text: t, font: F, size: o.size || 21, bold: o.bold, color: o.color, italics: o.italics });
const p = (kids, o = {}) => new Paragraph({ spacing: { after: o.after ?? 100, line: 290 }, children: kids });
const linha = { style: BorderStyle.SINGLE, size: 4, color: 'D5D0E8' }, nada = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const W = [1250, 2300, 1300, 4176];
const cel = (kids, i, head) => new TableCell({ width: { size: W[i], type: WidthType.DXA }, borders: { top: linha, bottom: linha, left: nada, right: nada },
  shading: head ? { fill: 'EFECFB', type: ShadingType.CLEAR, color: 'auto' } : undefined, margins: { top: 90, bottom: 90, left: 110, right: 110 }, children: [p(kids, { after: 0 })] });
const cor = { 'Narração': '2E2A3F', 'Ju': '4C9A50', 'Abelha': 'B7791F', 'Ju e Narração': '4C9A50' };

const doc = new Document({ sections: [{
  properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, bottom: 1200, left: 1300, right: 1300 } } },
  children: [
    p([run('Roteiro de dublagem do comercial', { size: 36, bold: true, color: '2E2A3F' })], { after: 60 }),
    p([run('TalkGarden – Projeto Integrador · vídeo de 2:19', { size: 24, color: '5D5874' })], { after: 260 }),
    p([run('São três vozes: a narração, a Ju (uma criança de uns 7 anos) e a abelha (animada e carinhosa). O tempo de cada fala acompanha o que aparece na tela; se uma frase não couber, dá para encurtar, desde que mantenha o sentido. Na cena do zumbido, se quiserem, pode entrar um “bzzz” gravado por vocês.')], { after: 160 }),
    p([run('Os textos entre parênteses são o jeito de falar, não fazem parte da fala.', { italics: true, color: '6B6789' })], { after: 260 }),
    new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: W, rows: [
      new TableRow({ tableHeader: true, children: ['Tempo', 'O que aparece', 'Quem fala', 'Fala'].map((h, i) => cel([run(h, { bold: true })], i, true)) }),
      ...FALAS.map(([t, c, q, f]) => new TableRow({ cantSplit: true, children: [
        cel([run(t, { bold: true, color: '5B4FA8' })], 0), cel([run(c)], 1), cel([run(q, { bold: true, color: cor[q] })], 2), cel([run(f)], 3)] })),
    ] }),
  ] }] });
Packer.toBuffer(doc).then(b => { const out = path.join(__dirname, '..', 'Roteiro de dublagem - Comercial PI.docx'); fs.writeFileSync(out, b); console.log('ok', out); });
