// Monta o comercial: abertura (vídeos reais) + sistema gravado + final, com legendas e música.
// Uso: node montar.js            -> vídeo completo
//      node montar.js 5,30,80    -> só fotos de conferência nesses segundos
const puppeteer = require('../fonte/node_modules/puppeteer-core');
const ffmpeg = require('../fonte/node_modules/ffmpeg-static');
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const T = require('./textos.js');
const G = require('./gravacao.json');
const DIR = __dirname;
const FPS = 30;
const SAIDA = path.join(DIR, '..', 'Comercial TalkGarden - PI.mp4');

// ---------- linha do tempo ----------
const segmentos = [], legendas = [];
let t = 0;
function addFala(ini, fim, texto) {
  if (!texto) return;
  const palavras = texto.split(/\s+/).filter(Boolean);
  // pedaços de até 3 palavras, quebrando depois de pontuação
  const ped = []; let atual = [];
  for (const w of palavras) { atual.push(w); if (atual.length === 3 || /[,.?!:]$/.test(w.replace(/\*/g, ''))) { ped.push(atual); atual = []; } }
  if (atual.length) ped.push(atual);
  const fala = Math.min(fim - ini - 0.15, T.tempoFala(texto) - 0.6);
  const porPalavra = fala / palavras.length;
  let c = ini; const pedacos = [];
  for (const p of ped) {
    const d = porPalavra * p.length;
    const html = p.map(w => w.includes('*') ? `<span class="am">${w.replace(/\*/g, '')}</span>` : w).join(' ');
    pedacos.push({ ini: +c.toFixed(3), fim: +(c + d).toFixed(3), html }); c += d;
  }
  legendas.push({ ini, fim, pedacos });
}
function addLista(lista, rodape) {
  for (const s of lista) {
    const seg = s.logo ? { tipo: 'logo', ini: t, fim: t + s.dur, rodape } : { tipo: 'clipe', ini: t, fim: t + s.dur, dir: `clipes/${s.clipe}-${s.de}` };
    if (seg.tipo === 'clipe') seg.n = fs.readdirSync(path.join(DIR, seg.dir)).length;
    segmentos.push(seg); addFala(t, t + s.dur, s.texto); t += s.dur;
  }
}
addLista(T.abertura, false);
const iniSistema = t;
segmentos.push({ tipo: 'sistema', ini: t, fim: t + G.duracao });
G.marcas.forEach((m, i) => {
  const fim = i + 1 < G.marcas.length ? G.marcas[i + 1].t : G.duracao;
  addFala(iniSistema + m.t, iniSistema + fim, T.sistema.find(s => s.id === m.id).texto);
});
t += G.duracao;
addLista(T.final, true);
const LT = { segmentos, legendas, quadros: G.quadros, zooms: G.zooms, total: t };
fs.writeFileSync(path.join(DIR, 'linha-do-tempo.json'), JSON.stringify({ segmentos, legendas, total: t }, null, 1));

(async () => {
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  const erros = []; p.on('pageerror', e => erros.push(e.message));
  await p.goto('file:///' + path.join(DIR, 'compor.html').split(path.sep).join('/'));
  await p.evaluate(lt => { window.LT = lt; }, LT);
  await p.evaluate(() => document.fonts.ready);
  const fotos = process.argv[2];
  if (fotos) {
    fs.mkdirSync(path.join(DIR, 'prova'), { recursive: true });
    for (const s of fotos.split(',')) { await p.evaluate(x => window.quadro(x), +s); await p.screenshot({ path: path.join(DIR, 'prova', `f-${s}.jpg`), type: 'jpeg', quality: 85 }); }
    console.log('fotos ok', erros); await b.close(); return;
  }
  const video = path.join(DIR, 'video-sem-som.mp4');
  const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', '-r', String(FPS), video], { stdio: ['pipe', 'ignore', 'pipe'] });
  let err = ''; ff.stderr.on('data', d => { err = (err + d).slice(-2000); });
  const total = Math.round(t * FPS);
  for (let f = 0; f < total; f++) {
    await p.evaluate(x => window.quadro(x), f / FPS);
    const jpg = await p.screenshot({ type: 'jpeg', quality: 92, optimizeForSpeed: true });
    if (!ff.stdin.write(jpg)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % 300 === 0) console.log(`quadro ${f}/${total}`);
  }
  ff.stdin.end();
  if (await new Promise(r => ff.on('close', r)) !== 0) { console.error(err); process.exit(1); }
  await b.close();
  // música leve por baixo, com entrada e saída suaves
  const r = spawnSync(ffmpeg, ['-y', '-i', video, '-i', path.join(DIR, 'midia', 'musica.mp3'),
    '-filter_complex', `[1:a]atrim=0:${t.toFixed(2)},volume=0.32,afade=t=in:st=0:d=1.5,afade=t=out:st=${(t - 3).toFixed(2)}:d=3[m]`,
    '-map', '0:v', '-map', '[m]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', SAIDA], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stderr.slice(-2000)); process.exit(1); }
  console.log('pronto', SAIDA, t.toFixed(1) + 's', 'erros:', erros);
})();
