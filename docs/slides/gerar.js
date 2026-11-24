// Gera "Apresentacao PI - TalkGarden.html" (arquivo único, com as imagens dentro) e o PDF
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const RAIZ = path.resolve(__dirname, '..', '..');
const A = path.join(__dirname, 'assets');

const caminho = n => ({ 'logo.svg': path.join(RAIZ, 'img', 'logo.svg'), 'fundo.svg': path.join(RAIZ, 'img', 'fundo.svg') }[n] || path.join(A, n));
const dataUri = n => {
  const f = caminho(n), ext = path.extname(f).slice(1);
  return `data:${ext === 'svg' ? 'image/svg+xml' : 'image/' + ext};base64,` + fs.readFileSync(f).toString('base64');
};
// flores do próprio sistema na borda de baixo
const dados = fs.readFileSync(path.join(RAIZ, 'js', 'data.js'), 'utf8');
const FLOWERS = new Function(dados.slice(dados.indexOf('const FLOWERS'), dados.indexOf('const PICS')) + 'return FLOWERS;')();
const flores = '<div class="flores">' + ['rosa', 'tulipa', 'azul', 'amarela', 'lilas', 'rosa', 'azul', 'tulipa', 'amarela', 'lilas', 'rosa', 'azul']
  .map((f, i) => (i > 2 && i < 9) ? '' : FLOWERS[f](130)).join('') + '</div>';

const canto = (lado, itens) => '<div class="canto ' + lado + '">' + itens.map(([f, h]) => FLOWERS[f](h)).join('') + '</div>';
const { abelha } = require('../../video/comercial/personagens.js');
const ab = '<div class="ab">' + abelha({ asa: 1 }) + '</div>';
// ramo com folhas saindo do canto (espelhado no lado direito)
const ramo = (h, esp) => `<svg viewBox="-8 -14 222 276" height="${h}" style="transform:scaleX(${esp ? -1 : 1})"><path d="M10 260C30 190 60 140 120 90S190 20 196 8" stroke="#5D9E3B" stroke-width="5" fill="none" stroke-linecap="round"/>${[[42,190,-40],[70,150,30],[98,116,-35],[132,84,25],[160,52,-30],[184,24,20]].map(([x,y,r],i)=>`<ellipse cx="${x}" cy="${y}" rx="22" ry="10" fill="${i%2?'#79B84A':'#93C96A'}" transform="rotate(${r} ${x} ${y}) translate(${i%2?14:-14} 0)"/>`).join('')}<circle cx="196" cy="8" r="8" fill="#F7A6C2"/></svg>`;
const enfeite = [
  canto('e', [['tulipa', 118], ['broto', 74], ['rosa', 132]]) + canto('d', [['amarela', 124], ['muda', 88], ['lilas', 108]]),
  '<div class="canto e">' + FLOWERS.azul(126) + ab + FLOWERS.amarela(108) + FLOWERS.broto(70) + '</div>' + '<div class="canto d">' + FLOWERS.muda(86) + FLOWERS.rosa(120) + '</div>',
  '<div class="canto e">' + ramo(300, false) + FLOWERS.broto(80) + '</div><div class="canto d">' + FLOWERS.tulipa(110) + ramo(270, true) + '</div>',
];
let html = fs.readFileSync(path.join(__dirname, 'slides.html'), 'utf8')
  .replace('{{enfeite}}', JSON.stringify(enfeite))
  .replace(/\{\{([^}]+)\}\}/g, (m, n) => dataUri(n));
const OUT = path.join(RAIZ, 'docs', 'Apresentacao PI - TalkGarden.html');
fs.writeFileSync(OUT, html);


console.log('ok', (fs.statSync(OUT).size / 1e6).toFixed(1) + ' MB');
