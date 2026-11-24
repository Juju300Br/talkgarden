// Gera o roteiro de dublagem (Word) com o tempo de cada etapa do vídeo
const fs = require('fs');
const path = require('path');
const D = require(process.argv[2]);
const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle, AlignmentType, ShadingType } = D;
const roteiro = require('./roteiro.js');
const marcas = require('./marcas.json');
const DUR = require('./duracoes.json');
const TOTAL = 141.9;

const mmss = t => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}`;
const F = 'Calibri';
const run = (t, o = {}) => new TextRun({ text: t, font: F, size: o.size || 22, bold: o.bold, color: o.color });
const p = (kids, o = {}) => new Paragraph({ spacing: { after: o.after ?? 120, line: 300 }, alignment: o.align, children: kids });

const linha = { style: BorderStyle.SINGLE, size: 4, color: 'D5D0E8' };
const nada = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const bordas = { top: linha, bottom: linha, left: nada, right: nada };
const W = [1500, 2300, 5226];
const cel = (kids, i, head) => new TableCell({
  width: { size: W[i], type: WidthType.DXA }, borders: bordas,
  shading: head ? { fill: 'EFECFB', type: ShadingType.CLEAR, color: 'auto' } : undefined,
  margins: { top: 100, bottom: 100, left: 120, right: 120 },
  children: [p(kids, { after: 0 })],
});
const linhas = marcas.map((m, i) => {
  const fim = i + 1 < marcas.length ? marcas[i + 1].t : TOTAL;
  const f = roteiro.find(r => r.id === m.id);
  const titulo = m.id === 'abertura' ? 'Abertura' : m.id === 'fim' ? 'Encerramento' : f.titulo;
  return new TableRow({ cantSplit: true, children: [
    cel([run(`${mmss(m.t)} – ${mmss(fim)}`, { bold: true, color: '5B4FA8' })], 0),
    cel([run(titulo, { bold: true })], 1),
    cel([run(f.texto)], 2),
  ] });
});

const doc = new Document({
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, bottom: 1300, left: 1440, right: 1440 } } },
    children: [
      p([run('Roteiro de dublagem', { size: 36, bold: true, color: '2E2A3F' })], { after: 60 }),
      p([run('Vídeo TalkGarden-demonstracao.mp4 (2:22)', { size: 24, color: '5D5874' })], { after: 300 }),
      p([run('Cada fala começa no tempo indicado, junto com a legenda da etapa no canto da tela. O espaço de cada etapa foi medido para uma leitura em ritmo calmo, então dá para gravar com folga. Se quiser mudar alguma frase, mantenha mais ou menos o mesmo tamanho.')], { after: 300 }),
      new Table({
        width: { size: 9026, type: WidthType.DXA }, columnWidths: W,
        rows: [new TableRow({ tableHeader: true, children: [cel([run('Tempo', { bold: true })], 0, 1), cel([run('Etapa', { bold: true })], 1, 1), cel([run('Fala', { bold: true })], 2, 1)] }), ...linhas],
      }),
    ],
  }],
});
Packer.toBuffer(doc).then(b => {
  const out = path.join(__dirname, '..', 'Roteiro de dublagem - TalkGarden.docx');
  fs.writeFileSync(out, b); console.log('ok', out);
});
