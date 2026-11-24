// fotos de conferência de cada slide e PDF a partir do modo de apresentação
const puppeteer = require('../../video/fonte/node_modules/puppeteer-core');
const path = require('path');
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  const p = await b.newPage(); await p.setViewport({ width: 1920, height: 1080 });
  const url = 'file:///' + path.resolve(__dirname, '..', 'Apresentacao PI - TalkGarden.html').split(path.sep).join('/');
  await p.goto(url); await p.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  const n = await p.evaluate(() => document.querySelectorAll('.slide').length);
  for (let i = 1; i <= n; i++) { await p.evaluate(i => { location.hash = '#' + i; mostra(i - 1); }, i); await new Promise(r => setTimeout(r, 500)); await p.screenshot({ path: path.join(__dirname, `s-${String(i).padStart(2, '0')}.png`) }); }
  await p.emulateMediaType('print');
  await p.pdf({ path: path.resolve(__dirname, '..', 'Apresentacao PI - TalkGarden.pdf'), width: '1920px', height: '1080px', printBackground: true, preferCSSPageSize: true });
  await b.close(); console.log('ok', n);
})();
