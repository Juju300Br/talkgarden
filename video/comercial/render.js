// Renderiza cenas.html quadro a quadro. Uso:
//   node render.js abertura saida.mp4           (vídeo inteiro da parte)
//   node render.js abertura prova 3,10,30        (fotos de conferência nos segundos indicados)
const puppeteer = require('../fonte/node_modules/puppeteer-core');
const ffmpeg = require('../fonte/node_modules/ffmpeg-static');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const [parte, saida, tempos] = process.argv.slice(2);
const FPS = 30;
(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--hide-scrollbars', '--allow-file-access-from-files'] });
  const page = await b.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  const erros = []; page.on('pageerror', e => erros.push(e.message));
  await page.goto('file:///' + path.resolve(__dirname, 'cenas.html').replace(/\\/g, '/') + '#' + parte);
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
  if (tempos) {
    for (const t of tempos.split(',')) { await page.evaluate(x => window.quadro(x), +t); await page.screenshot({ path: `${saida}-${t}.png` }); }
    console.log('erros:', erros); await b.close(); return;
  }
  const dur = await page.evaluate(() => window.DURACAO);
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '16', '-pix_fmt', 'yuv420p', '-r', String(FPS), saida], { stdio: ['pipe', 'ignore', 'pipe'] });
  let err = ''; ff.stderr.on('data', d => { err = (err + d).slice(-2000); });
  const total = Math.round(dur * FPS);
  for (let f = 0; f < total; f++) {
    await page.evaluate(x => window.quadro(x), f / FPS);
    const png = await page.screenshot({ type: 'png', optimizeForSpeed: true });
    if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) console.log(`${parte}: ${f}/${total}`);
  }
  ff.stdin.end();
  const code = await new Promise(r => ff.on('close', r));
  await b.close();
  if (code !== 0) { console.error(err); process.exit(1); }
  console.log('pronto', saida, 'erros:', erros);
})();
