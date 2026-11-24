// Roteiro de dublagem do comercial novo, com os tempos tirados da linha do tempo
const fs = require('fs');
const path = require('path');
const D = require(process.argv[2]);
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = D;
const LT = require('./linha-do-tempo.json');
const T = require('./textos.js');

const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const nomes = { cadastro: 'Cadastro', senha: 'Recuperar a senha', login: 'Login', inicio: 'Tela inicial', vocab: 'Jogo de Vocabulário', recompensa: 'Recompensa', frases: 'Formando Frases', medalha: 'Medalha nova', jardim: 'Jardim', conquistas: 'Conquistas', estatisticas: 'Estatísticas', perfil: 'Perfil e configurações', sair: 'Sair' };
const cenas = [...T.abertura.map(s => s.logo ? 'Logo do TalkGarden' : 'Criança com dificuldade na lição'),
  ...T.sistema.map(s => nomes[s.id]), ...T.final.map(s => s.logo ? 'Logo do TalkGarden (final)' : 'Criança feliz estudando com a família')];
const textos = [...T.abertura, ...T.sistema, ...T.final].map(s => s.texto).filter(Boolean);
const cenasComFala = [...T.abertura, ...T.sistema, ...T.final].map((s, i) => [s, cenas[i]]).filter(([s]) => s.texto).map(([, c]) => c);

const F = 'Calibri';
const run = (t, o = {}) => new TextRun({ text: t, font: F, size: o.size || 22, bold: o.bold, color: o.color, italics: o.italics });
const par = (kids, after = 100) => new Paragraph({ spacing: { after, line: 290 }, children: kids });
const linha = { style: BorderStyle.SINGLE, size: 4, color: 'D5D0E8' }, nada = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const W = [1400, 2600, 5026];
const cel = (kids, i, head) => new TableCell({ width: { size: W[i], type: WidthType.DXA }, borders: { top: linha, bottom: linha, left: nada, right: nada },
  shading: head ? { fill: 'EFECFB', type: ShadingType.CLEAR, color: 'auto' } : undefined, margins: { top: 90, bottom: 90, left: 110, right: 110 }, children: [par(kids, 0)] });

const linhas = LT.legendas.map((L, i) => new TableRow({ cantSplit: true, children: [
  cel([run(`${mmss(L.ini)} – ${mmss(L.fim)}`, { bold: true, color: '5B4FA8' })], 0),
  cel([run(cenasComFala[i] || '')], 1),
  cel([run(textos[i].replace(/\*/g, ''))], 2)] }));

const doc = new Document({ sections: [{
  properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1200, bottom: 1200, left: 1300, right: 1300 } } },
  children: [
    par([run('Roteiro de dublagem do comercial', { size: 36, bold: true, color: '2E2A3F' })], 60),
    par([run(`TalkGarden – Projeto Integrador · vídeo de ${mmss(LT.total)}`, { size: 24, color: '5D5874' })], 240),
    par([run('Uma voz só, de narração. O vídeo não tem legenda: cada fala tem a janela de tempo indicada na primeira coluna, então é só começar a fala no tempo marcado, num ritmo calmo. Se sobrar um pouquinho de tempo, tudo bem, é melhor do que correr. A música de fundo já está no vídeo, mais baixa, para a voz ficar por cima.')], 260),
    new Table({ width: { size: 9026, type: WidthType.DXA }, columnWidths: W, rows: [
      new TableRow({ tableHeader: true, children: ['Tempo', 'O que aparece', 'Fala'].map((h, i) => cel([run(h, { bold: true })], i, true)) }), ...linhas] }),
  ] }] });
const out = path.join(__dirname, '..', 'Roteiro de dublagem - Comercial PI.docx');
Packer.toBuffer(doc).then(b => { try { fs.writeFileSync(out, b); console.log('ok', out); } catch (e) { const alt = out.replace('.docx', ' (novo).docx'); fs.writeFileSync(alt, b); console.log('ok', alt); } });
