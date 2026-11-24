// Grava o TalkGarden funcionando (navegador automático + cursor visível) e monta o vídeo com a narração.
// Uso: node gravar.js [saida.mp4]
const puppeteer = require('puppeteer-core');
const ffmpeg = require('ffmpeg-static');
const { spawnSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');
const roteiro = require('./roteiro.js');
const DUR = require('./duracoes.json');

const SAIDA = path.resolve(process.argv[2] || path.join(__dirname, '..', 'TalkGarden-demonstracao.mp4'));
const APP = process.env.TG_URL || 'http://localhost/talkgarden/';
const EDGE = 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const W = 1600, H = 900, ESCALA = 1.2; // quadros de 1920x1080
const QUADROS = path.join(__dirname, 'quadros');
const TITULO = Object.fromEntries(roteiro.map(f => [f.id, f.titulo]));

const espera = ms => new Promise(r => setTimeout(r, ms));

// ---------- camada desenhada por cima do sistema: cursor, legenda e cartões ----------
const CAMADA = `
#demo-cursor{position:fixed;left:0;top:0;width:30px;height:30px;z-index:2147483647;pointer-events:none;
  transform:translate(800px,450px);transition:transform .7s cubic-bezier(.45,.05,.25,1)}
#demo-cursor svg{filter:drop-shadow(0 2px 3px rgba(0,0,0,.35))}
.demo-ripple{position:fixed;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;z-index:2147483646;pointer-events:none;
  border:3px solid #7C6FCB;animation:demoRip .55s ease-out forwards}
@keyframes demoRip{from{transform:scale(.3);opacity:1}to{transform:scale(1.4);opacity:0}}
#demo-legenda{position:fixed;right:28px;bottom:26px;z-index:2147483645;pointer-events:none;
  background:#fff;color:#2E2A3F;font:600 22px 'Segoe UI',sans-serif;padding:12px 22px;border-radius:14px;
  box-shadow:0 6px 22px rgba(46,42,63,.18);transition:opacity .35s, transform .35s}
#demo-legenda.oculta{opacity:0;transform:translateY(10px)}
#demo-cartao{position:fixed;inset:0;z-index:2147483640;background:#fff;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:18px;transition:opacity .8s;font-family:'Segoe UI',sans-serif}
#demo-cartao.oculto{opacity:0;pointer-events:none}
#demo-cartao img{width:150px;height:150px}
#demo-cartao h1{margin:0;font-size:64px;font-weight:800;letter-spacing:-1px}
#demo-cartao h1 .t{color:#7C6FCB}#demo-cartao h1 .g{color:#4C9A50}
#demo-cartao p{margin:0;font-size:26px;color:#5d5874}
`;
function instalarCamada(css) {
  const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  const c = document.createElement('div'); c.id = 'demo-cursor';
  c.innerHTML = '<svg viewBox="0 0 24 24" width="30" height="30"><path d="M4 2 L4 19 L8.5 14.8 L11.6 21.6 L14.6 20.2 L11.6 13.6 L17.8 13.6 Z" fill="#fff" stroke="#2E2A3F" stroke-width="1.6" stroke-linejoin="round"/></svg>';
  document.body.appendChild(c);
  const l = document.createElement('div'); l.id = 'demo-legenda'; l.className = 'oculta'; document.body.appendChild(l);
  const k = document.createElement('div'); k.id = 'demo-cartao'; k.className = 'oculto';
  k.innerHTML = '<img src="img/logo.svg" alt=""><h1><span class="t">Talk</span><span class="g">Garden</span></h1><p></p>';
  document.body.appendChild(k);
  // a voz do navegador não é gravada; a narração entra depois
  if (window.speechSynthesis) window.speechSynthesis.speak = () => {};
}

(async () => {
  fs.rmSync(QUADROS, { recursive: true, force: true }); fs.mkdirSync(QUADROS);
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-video-'));
  const browser = await puppeteer.launch({
    executablePath: EDGE, headless: true, userDataDir: perfil,
    args: ['--hide-scrollbars', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: ESCALA });
  await page.goto(APP);
  await page.evaluate(instalarCamada, CAMADA);
  await page.evaluate(() => document.fonts.ready);

  // ---------- gravação por screencast ----------
  const cdp = await page.createCDPSession();
  const quadros = [];
  cdp.on('Page.screencastFrame', async ({ data, metadata, sessionId }) => {
    const n = quadros.length;
    const arq = path.join(QUADROS, String(n).padStart(6, '0') + '.jpg');
    fs.writeFileSync(arq, Buffer.from(data, 'base64'));
    quadros.push({ arq, t: metadata.timestamp });
    cdp.send('Page.screencastFrameAck', { sessionId }).catch(() => {});
  });

  // ---------- ações com o cursor ----------
  let cur = { x: 800, y: 450 };
  async function alvo(spec) {
    const h = typeof spec === 'string' ? await page.waitForSelector(spec, { visible: true, timeout: 8000 }) : await page.evaluateHandle(spec);
    const fora = await h.evaluate(el => { const r = el.getBoundingClientRect(); return r.top < 70 || r.bottom > innerHeight - 20; });
    if (fora) { await h.evaluate(el => el.scrollIntoView({ behavior: 'smooth', block: 'center' })); await espera(700); }
    const b = await h.boundingBox();
    return { h, x: b.x + b.width / 2, y: b.y + b.height / 2 };
  }
  async function mover(x, y) {
    const d = Math.hypot(x - cur.x, y - cur.y);
    const ms = Math.round(Math.min(900, Math.max(350, d * 0.9)));
    await page.evaluate((x, y, ms) => {
      const c = document.getElementById('demo-cursor');
      c.style.transitionDuration = ms + 'ms';
      c.style.transform = `translate(${x - 4}px,${y - 2}px)`;
    }, x, y, ms);
    cur = { x, y };
    await espera(ms + 80);
  }
  async function clicar(spec, depois = 350) {
    const a = await alvo(spec);
    await mover(a.x, a.y);
    await page.evaluate((x, y) => {
      const r = document.createElement('div'); r.className = 'demo-ripple';
      r.style.left = x + 'px'; r.style.top = y + 'px'; document.body.appendChild(r);
      setTimeout(() => r.remove(), 600);
    }, a.x, a.y);
    await page.mouse.click(a.x, a.y);
    await espera(depois);
  }
  async function digitar(sel, texto) {
    await clicar(sel, 150);
    await page.keyboard.type(texto, { delay: 55 });
    await espera(200);
  }
  const legenda = t => page.evaluate(t => {
    const l = document.getElementById('demo-legenda');
    if (!t) { l.classList.add('oculta'); return; }
    l.textContent = t; l.classList.remove('oculta');
  }, t);
  const existe = sel => page.$eval(sel, el => !!el.offsetParent).catch(() => false);
  async function fecharRecompensa() {
    await page.waitForSelector('#mContinue', { visible: true, timeout: 8000 });
    await espera(1800);
    await clicar('#mContinue', 600);
    while (await existe('#mBadgeClose')) { await espera(2000); await clicar('#mBadgeClose', 600); }
  }

  // ---------- etapas: cada uma dura pelo menos o tempo da sua fala ----------
  const marcas = [];
  async function etapa(id, acoes, folga = 600) {
    const t0 = Date.now();
    marcas.push({ id, t: t0 / 1000 });
    if (TITULO[id] && id !== 'abertura' && id !== 'fim') await legenda(TITULO[id]);
    await acoes();
    const resta = t0 + DUR[id] * 1000 + folga - Date.now();
    if (resta > 0) await espera(resta);
  }

  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 88, everyNthFrame: 1 });
  await espera(300);
  const inicioVideo = Date.now() / 1000;

  // abertura: cartão com o logo e depois a tela de login
  await page.evaluate(() => {
    const k = document.getElementById('demo-cartao');
    k.querySelector('p').textContent = 'Demonstração do sistema';
    k.classList.remove('oculto');
  });
  await espera(400);
  await etapa('abertura', async () => {
    await espera(3800);
    await page.evaluate(() => document.getElementById('demo-cartao').classList.add('oculto'));
    await espera(1200);
    await mover(800, 520);
  }, 300);

  await etapa('cadastro', async () => {
    await clicar('[data-go="register"]', 700);
    await digitar('#regName', 'Ana Lima');
    await digitar('#regChild', 'Pedro');
    await digitar('#regEmail', 'ana@email.com');
    await digitar('#regPass', '123456');
    await digitar('#regPass2', '123456');
    await clicar('#formRegister button[type="submit"]', 900);
  });

  await etapa('login', async () => {
    await digitar('#loginPass', '123456');
    await clicar('#formLogin button[type="submit"]', 900);
  });

  await etapa('questionario', async () => {
    await clicar(() => document.querySelector('#scrDiag input[value="nao"]').closest('label'), 300);
    await clicar(() => document.querySelectorAll('#scrSinais label')[0], 250);
    await clicar(() => document.querySelectorAll('#scrSinais label')[2], 250);
    await digitar('#scrIdade', '7');
    await clicar('#formScreening button[type="submit"]', 600);
    await page.waitForSelector('#mScrOk', { visible: true });
    await espera(3200);
    await clicar('#mScrOk', 700);
  });

  await etapa('inicio', async () => {
    await espera(800);
    for (const s of ['.game-card.vocab', '.game-card.phrase', '.game-card.cmd', '.game-card.story']) {
      const a = await alvo(s); await mover(a.x, a.y - 40); await espera(150);
    }
  }, 300);

  await etapa('vocab', async () => {
    await clicar('.game-card.vocab .play-btn', 1000);
    for (let i = 0; i < 3; i++) {
      await page.waitForFunction(() => document.querySelectorAll('#matchGrid .match-tile:not(.disabled)').length === 3);
      await espera(700);
      const certo = await page.evaluate(() => vocab.queue[vocab.idx].key);
      if (i === 0) { // um erro de propósito para mostrar o incentivo
        await clicar(`#matchGrid .match-tile:not([data-key="${certo}"])`, 1300);
      }
      await clicar(`#matchGrid .match-tile[data-key="${certo}"]`, 1500);
    }
  }, 0);

  await etapa('recompensa', fecharRecompensa, 300);

  await etapa('frases', async () => {
    await clicar('.game-card.phrase .play-btn', 1100);
    const n = await page.evaluate(() => phrase.item.words.length);
    for (let i = 0; i < n; i++) await clicar(`#wordPool .word-block[data-i="${i}"]`, 250);
    await clicar('#btnCheckPhrase', 400);
    await fecharRecompensa();
  }, 0);

  await etapa('comandos', async () => {
    await clicar('.game-card.cmd .play-btn', 1000);
    for (let i = 0; i < 4; i++) {
      await page.waitForFunction(i => cmd.idx === i && !cmd.locked, {}, i);
      await espera(900);
      const resp = await page.evaluate(() => cmd.queue[cmd.idx].answer);
      for (const r of resp) await clicar(`#cmdGrid .match-tile[data-id="${r}"]`, 300);
      await espera(1100);
    }
    await fecharRecompensa();
  }, 0);

  await etapa('historia', async () => {
    await clicar('.game-card.story .play-btn', 1800);
    for (let k = 0; k < 3; k++) await clicar(`#storyPool .story-card[data-i="${k}"]`, 300);
    await clicar('#btnCheckStory', 400);
    await page.waitForSelector('#storyOptions .story-opt', { visible: true });
    await espera(1200);
    await clicar(() => [...document.querySelectorAll('#storyOptions .story-opt')].find(b => b.dataset.opt === story.h.opcoes[0]), 400);
    await fecharRecompensa();
  }, 0);

  await etapa('jardim', async () => {
    await clicar('.nav-btn[data-view="garden"]', 900);
    await mover(900, 600);
  });

  await etapa('conquistas', async () => {
    await clicar('.nav-btn[data-view="achievements"]', 900);
    await mover(900, 500);
  });

  await etapa('estatisticas', async () => {
    await clicar('.nav-btn[data-view="stats"]', 1200);
    await mover(900, 420);
    await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'smooth' }));
    await espera(1500);
  });

  await etapa('perfil', async () => {
    await clicar('.profile-chip', 900);
    await clicar('.avatar-opt:nth-child(3)', 500);
    await clicar('[data-setting="bigText"] + .slider', 1300);
    await clicar('[data-setting="bigText"] + .slider', 600);
    await clicar('#formProfile button[type="submit"]', 900);
  });

  await etapa('sair', async () => {
    await clicar('#btnLogout', 600);
    await page.waitForSelector('#mLeave', { visible: true });
    await espera(1800);
    await clicar('#mLeave', 900);
  });

  await etapa('fim', async () => {
    await legenda('');
    await page.evaluate(() => {
      const k = document.getElementById('demo-cartao');
      k.querySelector('p').textContent = 'Aprender brincando, uma flor de cada vez.';
      k.classList.remove('oculto');
    });
  }, 1800);

  const fimVideo = Date.now() / 1000;
  await cdp.send('Page.stopScreencast');
  await espera(300);
  await browser.close();
  fs.rmSync(perfil, { recursive: true, force: true });

  // ---------- montagem: quadros com o tempo real de cada um + falas nos seus instantes ----------
  const t0 = quadros[0].t;
  const lista = quadros.map((q, i) => {
    const prox = i + 1 < quadros.length ? quadros[i + 1].t : fimVideo;
    return `file '${q.arq.replace(/\\/g, '/')}'\nduration ${Math.max(0.001, prox - q.t).toFixed(4)}`;
  });
  lista.push(`file '${quadros[quadros.length - 1].arq.replace(/\\/g, '/')}'`);
  fs.writeFileSync(path.join(__dirname, 'quadros.txt'), lista.join('\n'));

  const entradas = [], filtros = [];
  marcas.forEach((m, i) => {
    entradas.push('-i', path.join(__dirname, 'audio', m.id + '.mp3'));
    filtros.push(`[${i + 1}:a]adelay=${Math.max(0, Math.round((m.t - t0) * 1000))}:all=1[a${i}]`);
  });
  const mix = `${filtros.join(';')};${marcas.map((_, i) => `[a${i}]`).join('')}amix=inputs=${marcas.length}:normalize=0[voz]`;
  const total = (fimVideo - t0).toFixed(2);
  const r = spawnSync(ffmpeg, ['-y', '-f', 'concat', '-safe', '0', '-i', path.join(__dirname, 'quadros.txt'), ...entradas,
    '-filter_complex', mix, '-map', '0:v', '-map', '[voz]',
    '-vf', 'scale=1920:1080:flags=lanczos,format=yuv420p', '-r', '30', '-fps_mode', 'cfr',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-c:a', 'aac', '-b:a', '160k',
    '-t', total, '-movflags', '+faststart', SAIDA], { encoding: 'utf8' });
  if (r.status !== 0) { console.error(r.stderr.slice(-3000)); process.exit(1); }
  console.log(`pronto: ${SAIDA}  ${total}s  ${quadros.length} quadros  (início do vídeo ${(t0 - inicioVideo).toFixed(2)}s)`);
  fs.writeFileSync(path.join(__dirname, 'marcas.json'), JSON.stringify(marcas.map(m => ({ id: m.id, t: +(m.t - t0).toFixed(2) })), null, 1));
})().catch(e => { console.error(e); process.exit(1); });
