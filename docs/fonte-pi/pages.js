// Lê o texto do PDF (uma página por \f) e descobre em que página está cada título/legenda
const fs = require('fs');
const [, , txtFile, outFile] = process.argv;
const pages = fs.readFileSync(txtFile, 'utf8').split('\f');
const T = JSON.parse(fs.readFileSync(__dirname + '/targets.json', 'utf8'));
const norm = s => s.replace(/\s+/g, ' ').trim();
const lines = pages.map(p => p.split('\n').map(norm).filter(Boolean));
// início do texto: primeira página com "1 INTRODUÇÃO" que não seja o sumário
let start = lines.findIndex(ls => ls.includes('1 INTRODUÇÃO') && !ls.includes('SUMÁRIO'));
const res = {}, miss = [];
let cur = start;
const find = (label, from) => {
  const key = norm(label);
  for (let p = from; p < lines.length; p++) if (lines[p].some(l => l === key || l.includes(key) || key.startsWith(l) && l.length > 25)) return p;
  return -1;
};
for (const lab of [...T.toc]) { const p = find(lab, cur); if (p < 0) miss.push(lab); else { res[lab] = p; cur = p; } }
cur = start; for (const lab of T.figs) { const p = find(lab, cur); if (p < 0) miss.push(lab); else { res[lab] = p; cur = p; } }
cur = start; for (const lab of T.tabs) { const p = find(lab, cur); if (p < 0) miss.push(lab); else { res[lab] = p; cur = p; } }
// página exibida = física (base 1) − 1, pois a capa não é contada
for (const k in res) res[k] = res[k] + 1 - 1;
fs.writeFileSync(outFile, JSON.stringify(res, null, 1));
console.log('pages', pages.length - 1, 'textStart', start + 1, 'missing', miss);
