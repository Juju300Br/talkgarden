// Grava todo o funcionamento do TalkGarden (escopo do PI) com cursor visível.
// Salva os quadros do screencast, os instantes de cada etapa e as aproximações (zoom).
const puppeteer = require('../fonte/node_modules/puppeteer-core');
const fs = require('fs');
const os = require('os');
const path = require('path');
const T = require('./textos.js');

const DIR = __dirname;
const QUADROS = path.join(DIR, 'quadros');
const APP = 'file:///' + path.resolve(DIR, '..', '..', 'index.html').split(path.sep).join('/');
const ESCALA = 1.2; // 1600x900 -> 1920x1080
const espera = ms => new Promise(r => setTimeout(r, ms));
const MIN = Object.fromEntries(T.sistema.map(s => [s.id, T.tempoFala(s.texto)]));

const CSS = `
.game-card.cmd,.game-card.story{display:none!important}
.kpi:has(#sCmd),.kpi:has(#sStories){display:none!important}
#cur{position:fixed;left:0;top:0;width:30px;height:30px;z-index:2147483647;pointer-events:none;transform:translate(800px,450px);transition:transform .7s cubic-bezier(.45,.05,.25,1)}
#cur svg{filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
.rip{position:fixed;width:44px;height:44px;margin:-22px 0 0 -22px;border-radius:50%;z-index:2147483646;pointer-events:none;border:3px solid #7C6FCB;animation:rip .5s ease-out forwards}
@keyframes rip{from{transform:scale(.3);opacity:1}to{transform:scale(1.4);opacity:0}}`;

(async () => {
  fs.rmSync(QUADROS, { recursive: true, force: true }); fs.mkdirSync(QUADROS);
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-c2-'));
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, userDataDir: perfil, args: ['--hide-scrollbars', '--allow-file-access-from-files'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 900, deviceScaleFactor: ESCALA });
  await p.goto(APP);
  await p.evaluate(css => {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    const c = document.createElement('div'); c.id = 'cur';
    c.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M4 2 L4 19 L8.5 14.8 L11.6 21.6 L14.6 20.2 L11.6 13.6 L17.8 13.6 Z" fill="#fff" stroke="#2E2A3F" stroke-width="1.6" stroke-linejoin="round"/></svg>';
    document.body.appendChild(c);
    for (const id of ['ouvinte', 'contador']) { const i = BADGES.findIndex(x => x.id === id); if (i >= 0) BADGES.splice(i, 1); }
    if (window.speechSynthesis) window.speechSynthesis.speak = () => {};
  }, CSS);
  await p.evaluate(() => document.fonts.ready);

  const cdp = await p.createCDPSession();
  const quadros = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const arq = path.join(QUADROS, String(quadros.length).padStart(6, '0') + '.jpg');
    fs.writeFileSync(arq, Buffer.from(data, 'base64'));
    quadros.push({ f: path.basename(arq), t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });

  // ---------- ações ----------
  let cur = { x: 800, y: 450 };
  async function caixa(spec) {
    const h = typeof spec === 'string' ? await p.waitForSelector(spec, { visible: true, timeout: 8000 }) : await p.evaluateHandle(spec);
    const fora = await h.evaluate(el => { const r = el.getBoundingClientRect(); return r.top < 70 || r.bottom > innerHeight - 20; });
    if (fora) { await h.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' })); await espera(700); }
    return h.boundingBox();
  }
  async function mover(x, y) {
    const ms = Math.round(Math.min(800, Math.max(320, Math.hypot(x - cur.x, y - cur.y) * 0.85)));
    await p.evaluate((x, y, ms) => { const c = document.getElementById('cur'); c.style.transitionDuration = ms + 'ms'; c.style.transform = `translate(${x - 4}px,${y - 2}px)`; }, x, y, ms);
    cur = { x, y }; await espera(ms + 60);
  }
  async function clicar(spec, depois = 350) {
    const bx = await caixa(spec); const x = bx.x + bx.width / 2, y = bx.y + bx.height / 2;
    await mover(x, y);
    await p.evaluate((x, y) => { const r = document.createElement('div'); r.className = 'rip'; r.style.left = x + 'px'; r.style.top = y + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 550); }, x, y);
    await p.mouse.click(x, y); await espera(depois);
  }
  async function digitar(sel, texto) { await clicar(sel, 120); await p.keyboard.type(texto, { delay: 45 }); await espera(150); }
  const existe = sel => p.$eval(sel, el => !!el.offsetParent).catch(() => false);

  // aproximações: região na tela (px do quadro final) e escala
  const zooms = [];
  async function zoom(spec, escala = 1.45) {
    const bx = await caixa(spec);
    zooms.push({ t: Date.now() / 1000, x: (bx.x + bx.width / 2) * ESCALA, y: (bx.y + bx.height / 2) * ESCALA, s: escala });
  }
  const semZoom = () => zooms.push({ t: Date.now() / 1000, s: 1 });

  const marcas = [];
  async function etapa(id, acoes) {
    const t0 = Date.now(); marcas.push({ id, t: t0 / 1000 });
    await acoes();
    const resta = t0 + MIN[id] * 1000 - Date.now(); if (resta > 0) await espera(resta);
  }

  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 90, everyNthFrame: 1 });
  await espera(600);
  const inicio = Date.now() / 1000;

  await etapa('cadastro', async () => {
    await clicar('[data-go="register"]', 700);
    await zoom('#card-register', 1.35);
    await clicar('#formRegister button[type="submit"]', 1300);   // vazio: o sistema aponta os campos
    await digitar('#regName', 'Ana Souza');
    await digitar('#regChild', 'Ju');
    await digitar('#regEmail', 'ana.souza@email.com');
    await digitar('#regPass', '123456');
    await digitar('#regPass2', '123456');
    await clicar('#formRegister button[type="submit"]', 1200);
    semZoom();
    // a conta nova recebe o progresso da conta de demonstração (para o vídeo mostrar um jardim com flores)
    await p.evaluate(() => {
      const u = db.users['ana.souza@email.com'], d = db.users['demo@talkgarden.com'];
      Object.assign(u, JSON.parse(JSON.stringify(d)), { name: u.name, email: u.email, passHash: u.passHash, childName: 'Ju' });
      saveDB();
    });
  });

  await etapa('senha', async () => {
    await clicar('[data-go="forgot"]', 700);
    await zoom('#card-forgot', 1.4);
    await digitar('#forgotEmail', 'ana.souza@email.com');
    await clicar('#formForgot button[type="submit"]', 1300);
    await clicar('#card-sent [data-go="reset"]', 800);
    await digitar('#resetPass', 'jardim123');
    await digitar('#resetPass2', 'jardim123');
    await clicar('#formReset button[type="submit"]', 1300);
    semZoom();
  });

  await etapa('login', async () => {
    await zoom('#card-login', 1.35);
    await p.evaluate(() => { document.getElementById('loginPass').value = ''; });
    await digitar('#loginPass', 'senhaerrada');
    await clicar('#formLogin button[type="submit"]', 1600);       // senha errada: aviso
    await p.evaluate(() => { document.getElementById('loginPass').value = ''; });
    await digitar('#loginPass', 'jardim123');
    semZoom();
    await clicar('#formLogin button[type="submit"]', 1400);
  });

  await etapa('inicio', async () => {
    await espera(500);
    await zoom('.garden-card', 1.3); await mover(420, 560); await espera(900);
    semZoom();
    for (const s of ['.game-card.vocab', '.game-card.phrase']) { const bx = await caixa(s); await mover(bx.x + bx.width / 2, bx.y + 80); await espera(500); }
  });

  await etapa('vocab', async () => {
    await clicar('.game-card.vocab .play-btn', 1000);
    await zoom('#view-vocab .board', 1.3);
    for (let i = 0; i < 3; i++) {
      await p.waitForFunction(() => document.querySelectorAll('#matchGrid .match-tile:not(.disabled)').length === 3);
      await espera(700);
      const certo = await p.evaluate(() => vocab.queue[vocab.idx].key);
      if (i === 0) await clicar(`#matchGrid .match-tile:not([data-key="${certo}"])`, 1400);
      await clicar(`#matchGrid .match-tile[data-key="${certo}"]`, 1500);
    }
    semZoom();
  });

  await etapa('recompensa', async () => {
    await p.waitForSelector('#mContinue', { visible: true });
    await zoom('.modal', 1.4); await espera(1800); semZoom();
    await clicar('#mContinue', 700);
    while (await existe('#mBadgeClose')) { await espera(1500); await clicar('#mBadgeClose', 600); }
  });

  await etapa('frases', async () => {
    await clicar('.game-card.phrase .play-btn', 1200);
    await zoom('#view-phrase .board', 1.3);
    const n = await p.evaluate(() => phrase.item.words.length);
    // primeiro uma ordem errada, para mostrar o aviso
    const errada = [1, 0, ...Array.from({ length: n - 2 }, (_, k) => k + 2)];
    for (const i of errada) await clicar(`#wordPool .word-block[data-i="${i}"]`, 220);
    await clicar('#btnCheckPhrase', 1700);
    for (let i = 0; i < n; i++) await clicar(`#wordPool .word-block[data-i="${i}"]`, 220);
    await clicar('#btnCheckPhrase', 900);
    semZoom();
    await p.waitForSelector('#mContinue', { visible: true }); await espera(1500);
    await clicar('#mContinue', 700);
  });

  await etapa('medalha', async () => {
    if (await existe('#mSeeBadges')) { await zoom('.modal', 1.4); await espera(2200); semZoom(); await clicar('#mBadgeClose', 700); }
    while (await existe('#mBadgeClose')) await clicar('#mBadgeClose', 600);
  });

  await etapa('jardim', async () => {
    await clicar('.nav-btn[data-view="garden"]', 900);
    await zoom('#gardenPlants', 1.3); await mover(900, 600); await espera(1500); semZoom();
  });

  await etapa('conquistas', async () => {
    await clicar('.nav-btn[data-view="achievements"]', 900);
    await clicar('.badge.locked', 1500);
  });

  await etapa('estatisticas', async () => {
    await clicar('.nav-btn[data-view="stats"]', 1100);
    await zoom('.stats-grid', 1.35); await espera(1500); semZoom();
    await p.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' })); await espera(1500);
  });

  await etapa('perfil', async () => {
    await clicar('.profile-chip', 900);
    await clicar('.avatar-opt:nth-child(3)', 500);
    await clicar('[data-setting="bigText"] + .slider', 1300);
    await clicar('[data-setting="bigText"] + .slider', 600);
    await clicar('#formProfile button[type="submit"]', 1100);
  });

  await etapa('sair', async () => {
    await clicar('#btnLogout', 600);
    await zoom('.modal', 1.4);
    await espera(1500);
    await clicar('#mLeave', 1000);
    semZoom();
    await espera(800);
  });

  const fim = Date.now() / 1000;
  await cdp.send('Page.stopScreencast'); await espera(300);
  await b.close(); fs.rmSync(perfil, { recursive: true, force: true });
  const t0 = quadros[0].t;
  const rel = x => +(x - t0).toFixed(3);
  fs.writeFileSync(path.join(DIR, 'gravacao.json'), JSON.stringify({
    duracao: rel(fim), quadros: quadros.map(q => ({ f: q.f, t: rel(q.t) })),
    marcas: marcas.map(m => ({ id: m.id, t: rel(m.t) })), zooms: zooms.map(z => ({ ...z, t: rel(z.t) })),
  }));
  console.log('ok', rel(fim).toFixed(1) + 's', quadros.length, 'quadros', 'início', (t0 - inicio).toFixed(2));
})().catch(e => { console.error(e); process.exit(1); });
