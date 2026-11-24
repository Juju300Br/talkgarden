// Grava o TalkGarden funcionando para o comercial do PI: a abelha faz o papel do cursor.
// Só aparecem os dois jogos do PI (Vocabulário e Formando Frases).
// Uso: node gravar-sistema.js   -> sistema.mp4, tela-inicio.png e tela-fim.png nesta pasta
const puppeteer = require('../fonte/node_modules/puppeteer-core');
const ffmpeg = require('../fonte/node_modules/ffmpeg-static');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { abelha } = require('./personagens.js');

const DIR = __dirname;
const APP = 'file:///' + path.resolve(DIR, '..', '..', 'index.html').replace(/\\/g, '/');
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const QUADROS = path.join(DIR, 'quadros-sistema');
const espera = ms => new Promise(r => setTimeout(r, ms));

const CSS = `
.game-card.cmd,.game-card.story{display:none!important}
.kpi:has(#sCmd),.kpi:has(#sStories){display:none!important}
#guia{position:fixed;left:0;top:0;width:74px;height:84px;z-index:2147483647;pointer-events:none;
  transform:translate(1500px,780px);transition:transform .8s cubic-bezier(.45,.05,.3,1)}
#guia .corpo{width:100%;height:100%;animation:boia 1.6s ease-in-out infinite}
#guia.toque .corpo{animation:toque .35s ease-in-out}
@keyframes boia{0%,100%{transform:translateY(0) rotate(-4deg)}50%{transform:translateY(-7px) rotate(4deg)}}
@keyframes toque{0%{transform:translateY(0)}50%{transform:translateY(12px) scale(.92)}100%{transform:translateY(0)}}
.anel{position:fixed;width:54px;height:54px;margin:-27px 0 0 -27px;border-radius:50%;z-index:2147483646;pointer-events:none;
  border:3px solid #F5B92E;animation:anel .55s ease-out forwards}
@keyframes anel{from{transform:scale(.3);opacity:1}to{transform:scale(1.3);opacity:0}}
`;

(async () => {
  fs.rmSync(QUADROS, { recursive: true, force: true }); fs.mkdirSync(QUADROS);
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-pi-'));
  const browser = await puppeteer.launch({ executablePath: EDGE, headless: true, userDataDir: perfil, args: ['--hide-scrollbars', '--allow-file-access-from-files'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1.2 });
  await page.goto(APP);
  // as asas batem trocando dois desenhos da abelha
  const asaAberta = abelha({ asa: 1 }), asaFechada = abelha({ asa: 0.25 });
  await page.evaluate((css, a1, a2) => {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const g = document.createElement('div'); g.id = 'guia'; g.innerHTML = '<div class="corpo"></div>'; document.body.appendChild(g);
    let k = 0; setInterval(() => { g.firstChild.innerHTML = (k++ % 2) ? a2 : a1; }, 70);
    for (const id of ['ouvinte', 'contador']) { const i = BADGES.findIndex(b => b.id === id); if (i >= 0) BADGES.splice(i, 1); }
    if (window.speechSynthesis) window.speechSynthesis.speak = () => {};
  }, CSS, asaAberta, asaFechada);
  await page.evaluate(() => document.fonts.ready);
  await espera(600);
  await page.screenshot({ path: path.join(DIR, 'tela-inicio.png') });

  const cdp = await page.createCDPSession();
  const quadros = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const arq = path.join(QUADROS, String(quadros.length).padStart(6, '0') + '.jpg');
    fs.writeFileSync(arq, Buffer.from(data, 'base64'));
    quadros.push({ arq, t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });

  let pos = { x: 1500, y: 780 };
  async function alvo(spec) {
    const h = typeof spec === 'string' ? await page.waitForSelector(spec, { visible: true, timeout: 8000 }) : await page.evaluateHandle(spec);
    const fora = await h.evaluate(el => { const r = el.getBoundingClientRect(); return r.top < 70 || r.bottom > innerHeight - 20; });
    if (fora) { await h.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' })); await espera(700); }
    const b = await h.boundingBox();
    return { x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }
  async function voar(x, y) {
    const d = Math.hypot(x - pos.x, y - pos.y);
    const ms = Math.round(Math.min(1000, Math.max(450, d * 1.0)));
    // a ponta do ferrão (embaixo da abelha) fica sobre o alvo
    await page.evaluate((x, y, ms) => { const g = document.getElementById('guia'); g.style.transitionDuration = ms + 'ms'; g.style.transform = `translate(${x - 37}px,${y - 80}px)`; }, x, y, ms);
    pos = { x, y }; await espera(ms + 100);
  }
  async function tocar(spec, depois = 400) {
    const a = await alvo(spec);
    await voar(a.x, a.y);
    await page.evaluate((x, y) => {
      const g = document.getElementById('guia'); g.classList.remove('toque'); void g.offsetWidth; g.classList.add('toque');
      const r = document.createElement('div'); r.className = 'anel'; r.style.left = x + 'px'; r.style.top = y + 'px';
      document.body.appendChild(r); setTimeout(() => r.remove(), 600);
    }, a.x, a.y);
    await espera(180);
    await page.mouse.click(a.x, a.y);
    await espera(depois);
  }
  async function digitar(sel, texto) { await tocar(sel, 150); await page.keyboard.type(texto, { delay: 60 }); await espera(250); }
  const existe = sel => page.$eval(sel, el => !!el.offsetParent).catch(() => false);

  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, everyNthFrame: 1 });
  await espera(1200);

  // 1. o responsável entra com a conta de demonstração
  await digitar('#loginEmail', 'demo@talkgarden.com');
  await digitar('#loginPass', '123456');
  await tocar('#formLogin button[type="submit"]', 1600);

  // 2. tela inicial: a abelha mostra o jardim e os dois jogos
  for (const s of ['.garden-card', '.game-card.vocab', '.game-card.phrase']) { const a = await alvo(s); await voar(a.x, a.y - 30); await espera(700); }

  // 3. Jogo de Vocabulário (um erro de propósito, para mostrar o incentivo)
  await tocar('.game-card.vocab .play-btn', 1200);
  for (let i = 0; i < 3; i++) {
    await page.waitForFunction(() => document.querySelectorAll('#matchGrid .match-tile:not(.disabled)').length === 3);
    await espera(900);
    const certo = await page.evaluate(() => vocab.queue[vocab.idx].key);
    if (i === 0) await tocar(`#matchGrid .match-tile:not([data-key="${certo}"])`, 1500);
    await tocar(`#matchGrid .match-tile[data-key="${certo}"]`, 1600);
  }
  await page.waitForSelector('#mContinue', { visible: true });
  await espera(2600);
  await tocar('#mContinue', 900);
  while (await existe('#mBadgeClose')) { await espera(2200); await tocar('#mBadgeClose', 800); }

  // 4. Formando Frases
  await tocar('.game-card.phrase .play-btn', 1500);
  const n = await page.evaluate(() => phrase.item.words.length);
  for (let i = 0; i < n; i++) await tocar(`#wordPool .word-block[data-i="${i}"]`, 350);
  await tocar('#btnCheckPhrase', 600);
  await page.waitForSelector('#mContinue', { visible: true });
  await espera(2600);
  await tocar('#mContinue', 900);
  // a demonstração tem 24 frases: a 25ª desbloqueia a medalha "Mestre das frases"
  if (await existe('#mSeeBadges')) { await espera(2600); await tocar('#mSeeBadges', 2200); }
  while (await existe('#mBadgeClose')) { await espera(2200); await tocar('#mBadgeClose', 800); }

  // 5. jardim e estatísticas
  await tocar('.nav-btn[data-view="garden"]', 1200);
  await voar(900, 560); await espera(2200);
  await tocar('.nav-btn[data-view="stats"]', 1400);
  await voar(820, 330); await espera(1500);
  await page.evaluate(() => window.scrollTo({ top: 380, behavior: 'smooth' }));
  await voar(860, 520); await espera(2400);
  // a abelha sai voando pelo canto
  await voar(1700, -120); await espera(800);

  const fim = Date.now() / 1000;
  await cdp.send('Page.stopScreencast');
  await page.screenshot({ path: path.join(DIR, 'tela-fim.png') });
  await browser.close();
  fs.rmSync(perfil, { recursive: true, force: true });

  const lista = quadros.map((q, i) => `file '${q.arq.replace(/\\/g, '/')}'\nduration ${Math.max(0.001, (i + 1 < quadros.length ? quadros[i + 1].t : fim) - q.t).toFixed(4)}`);
  lista.push(`file '${quadros[quadros.length - 1].arq.replace(/\\/g, '/')}'`);
  fs.writeFileSync(path.join(DIR, 'quadros-sistema.txt'), lista.join('\n'));
  const r = spawnSync(ffmpeg, ['-y', '-f', 'concat', '-safe', '0', '-i', path.join(DIR, 'quadros-sistema.txt'),
    '-vf', 'scale=1920:1080:flags=lanczos,format=yuv420p', '-r', '30', '-fps_mode', 'cfr', '-c:v', 'libx264', '-crf', '17', '-preset', 'medium',
    path.join(DIR, 'sistema.mp4')], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stderr.slice(-2000)); process.exit(1); }
  fs.rmSync(QUADROS, { recursive: true, force: true }); fs.rmSync(path.join(DIR, 'quadros-sistema.txt'));
  console.log('pronto: sistema.mp4', (fim - quadros[0].t).toFixed(1) + 's');
})().catch(e => { console.error(e); process.exit(1); });
