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

let html = fs.readFileSync(path.join(__dirname, 'slides.html'), 'utf8')
  .replace('{{flores}}', flores)
  .replace(/\{\{([^}]+)\}\}/g, (m, n) => dataUri(n));
const OUT = path.join(RAIZ, 'docs', 'Apresentacao PI - TalkGarden.html');
fs.writeFileSync(OUT, html);


console.log('ok', (fs.statSync(OUT).size / 1e6).toFixed(1) + ' MB');
