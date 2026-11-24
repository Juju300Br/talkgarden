// Fotos das telas do sistema para os slides (só os dois jogos do PI)
const puppeteer = require('../../video/fonte/node_modules/puppeteer-core');
const fs = require('fs');
const os = require('os');
const path = require('path');
const T = path.join(__dirname, 'assets', 'telas');
fs.mkdirSync(T, { recursive: true });
const espera = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const perfil = fs.mkdtempSync(path.join(os.tmpdir(), 'tg-slides-'));
  const b = await puppeteer.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true, userDataDir: perfil, args: ['--allow-file-access-from-files', '--hide-scrollbars'] });
  const p = await b.newPage();
  await p.setViewport({ width: 1600, height: 900, deviceScaleFactor: 1.2 });
  await p.goto('file:///' + path.resolve(__dirname, '..', '..', 'index.html').split(path.sep).join('/'));
  await p.evaluate(() => {
    const s = document.createElement('style');
    s.textContent = '.game-card.cmd,.game-card.story{display:none!important}.kpi:has(#sCmd),.kpi:has(#sStories){display:none!important}*{animation-duration:0s!important;transition-duration:0s!important}';
    document.head.appendChild(s);
    for (const id of ['ouvinte', 'contador']) { const i = BADGES.findIndex(x => x.id === id); if (i >= 0) BADGES.splice(i, 1); }
    if (window.speechSynthesis) window.speechSynthesis.speak = () => {};
  });
  const foto = async nome => { await espera(500); await p.screenshot({ path: path.join(T, nome + '.png') }); };

  await foto('login');
  await p.click('[data-go="register"]'); await espera(300);
  await p.type('#regName', 'Ana Souza'); await p.type('#regChild', 'Ju'); await p.type('#regEmail', 'ana@email.com');
  await foto('cadastro');
  await p.click('[data-go="login"]').catch(() => p.evaluate(() => showAuth('login')));
  await p.evaluate(() => showAuth('login'));
  await p.type('#loginEmail', 'demo@talkgarden.com'); await p.type('#loginPass', '123456');
  await p.click('#formLogin button[type="submit"]');
  await p.waitForSelector('#view-home.active'); await foto('inicio');

  // vocabulário: mostra um acerto
  await p.evaluate(() => showView('vocab')); await espera(400);
  const certo = await p.evaluate(() => vocab.queue[vocab.idx].key);
  await p.click(`#matchGrid .match-tile[data-key="${certo}"]`); await foto('vocabulario');
  await espera(1500);
  for (let i = 0; i < 2; i++) {
    await p.waitForFunction(() => document.querySelectorAll('#matchGrid .match-tile:not(.disabled)').length === 3);
    const k = await p.evaluate(() => vocab.queue[vocab.idx].key);
    await p.click(`#matchGrid .match-tile[data-key="${k}"]`); await espera(1500);
  }
  await p.waitForSelector('#mContinue', { visible: true }); await foto('recompensa');
  await p.click('#mContinue'); await espera(400);
  while (await p.$eval('#mBadgeClose', el => !!el.offsetParent).catch(() => false)) { await p.click('#mBadgeClose'); await espera(400); }

  // formando frases: parte da frase montada
  await p.evaluate(() => showView('phrase')); await espera(400);
  const n = await p.evaluate(() => phrase.item.words.length);
  for (let i = 0; i < n - 2; i++) { await p.click(`#wordPool .word-block[data-i="${i}"]`); await espera(150); }
  await foto('frases');
  for (let i = n - 2; i < n; i++) { await p.click(`#wordPool .word-block[data-i="${i}"]`); await espera(150); }
  await p.click('#btnCheckPhrase'); await espera(1400);
  await p.waitForSelector('#mContinue', { visible: true }); await p.click('#mContinue'); await espera(500);
  if (await p.$eval('#mSeeBadges', el => !!el.offsetParent).catch(() => false)) await foto('medalha');

  await p.evaluate(() => { closeModal(); showView('garden'); }); await foto('jardim');
  await p.evaluate(() => showView('achievements')); await foto('conquistas');
  await p.evaluate(() => showView('stats')); await foto('estatisticas');
  await p.evaluate(() => showView('profile')); await foto('perfil');
  await b.close(); fs.rmSync(perfil, { recursive: true, force: true });
  console.log('ok', fs.readdirSync(T).join(' '));
})().catch(e => { console.error(e); process.exit(1); });
