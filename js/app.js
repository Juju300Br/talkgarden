const DAILY_GOAL = 4;

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

let user = null;
let resetEmail = null;

async function api(rota, dados = {}){
  try {
    const resp = await fetch('api/' + rota + '.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    return await resp.json();
  } catch {
    return { ok: false, erro: 'servidor' };
  }
}
function avisarFalha(r){
  if(!r.ok) toast('Não foi possível falar com o servidor. Verifique se o XAMPP está ligado.', 'err');
  return r.ok;
}

function dateKey(d = new Date()){
  return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
}
function streakOf(u){
  const d = new Date();
  if(!u.log[dateKey(d)]) d.setDate(d.getDate() - 1);
  let n = 0;
  while(u.log[dateKey(d)]){ n++; d.setDate(d.getDate() - 1); }
  return n;
}
function todayCount(){ return user.log[dateKey()] || 0; }

function shuffle(arr){
  const a = [...arr];
  for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
let toastTimer;
function toast(msg, kind = ''){
  const t = $('#toast');
  t.textContent = msg;
  t.className = 'toast show ' + kind;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.className = 'toast', 3000);
}
function renderStatic(root = document){
  $$('[data-icon]', root).forEach(el => el.innerHTML = ICONS[el.dataset.icon] || '');
  $$('[data-bee]', root).forEach(el => el.innerHTML = beeSVG());
  $$('[data-pic]', root).forEach(el => el.innerHTML = PICS[el.dataset.pic]);
}
function setFieldError(input, msg){
  const field = input.closest('.field');
  input.classList.add('invalid');
  if(field){
    field.classList.add('has-error');
    if(msg) $('.field-error', field).textContent = msg;
  }
}
function clearErrors(form){
  $$('.invalid', form).forEach(i => i.classList.remove('invalid'));
  $$('.has-error', form).forEach(f => f.classList.remove('has-error'));
}
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function openModal(html, {closeOnBackdrop = false} = {}){
  const root = $('#modalRoot');
  root.innerHTML = `<div class="overlay"><div class="modal">${html}</div></div>`;
  renderStatic(root);
  if(closeOnBackdrop){
    $('.overlay', root).addEventListener('click', e => { if(e.target.classList.contains('overlay')) closeModal(); });
  }
  return $('.modal', root);
}
function closeModal(){ $('#modalRoot').innerHTML = ''; }
function confetti(modal){
  const colors = ['#F0577E','#F5B92E','#6FBF73','#7C6FCB','#7FB6E8'];
  for(let i = 0; i < 36; i++){
    const s = document.createElement('span');
    s.className = 'confetti';
    s.style.left = Math.random() * 100 + '%';
    s.style.background = colors[i % colors.length];
    s.style.animationDelay = (Math.random() * .5) + 's';
    s.style.animationDuration = (1.2 + Math.random()) + 's';
    modal.appendChild(s);
  }
}

let actx = null;
function audio(){
  if(!actx){ try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if(actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, dur, delay = 0, type = 'sine', vol = .15){
  const ctx = audio(); if(!ctx) return;
  const t = ctx.currentTime + delay;
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(vol, t + .02);
  g.gain.exponentialRampToValueAtTime(.0001, t + dur);
  o.connect(g); g.connect(ctx.destination);
  o.start(t); o.stop(t + dur + .05);
}
const sfx = {
  ok(){ if(!user?.settings.sound) return; tone(660,.14); tone(880,.22,.12); },
  bad(){ if(!user?.settings.sound) return; tone(330,.18,0,'triangle',.12); tone(262,.26,.14,'triangle',.12); },
  win(){ if(!user?.settings.sound) return; [523,659,784,1046].forEach((f,i) => tone(f,.25,i*.11,'sine',.13)); },
  tap(){ if(!user?.settings.sound) return; tone(520,.06,0,'sine',.06); },
};
let musicTimer = null;
const MELODY = [392,440,523,440,392,330,392,0, 330,392,440,392,330,294,330,0];
function startMusic(){
  if(musicTimer) return;
  let i = 0;
  musicTimer = setInterval(() => {
    const f = MELODY[i++ % MELODY.length];
    if(f) tone(f, .5, 0, 'sine', .035);
  }, 480);
}
function stopMusic(){ clearInterval(musicTimer); musicTimer = null; }

function speak(text){
  if(!user?.settings.voice || !('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'pt-BR'; u.rate = .9; u.pitch = 1.15;
  const v = speechSynthesis.getVoices().find(v => v.lang && v.lang.toLowerCase().startsWith('pt'));
  if(v) u.voice = v;
  speechSynthesis.speak(u);
}

function showAuth(card, opts = {}){
  stopMusic();
  $('#app').classList.add('hidden');
  $('#auth').classList.remove('hidden');
  $$('#auth .auth-card').forEach(c => c.classList.add('hidden'));
  $('#card-' + card).classList.remove('hidden');
  $$('#auth form').forEach(f => { clearErrors(f); });
  $('#loginError').classList.add('hidden');
  const ok = $('#loginSuccess');
  ok.classList.toggle('hidden', !opts.success);
  if(opts.success) ok.textContent = opts.success;
  if(opts.email) $('#loginEmail').value = opts.email;
  if(card === 'register') $('#formRegister').reset();
  if(card === 'reset') $('#formReset').reset();
  const first = $('#card-' + card + ' input');
  if(first) setTimeout(() => first.focus(), 50);
}

function offlineGuard(alertEl){
  if(navigator.onLine) return false;
  if(alertEl){
    alertEl.textContent = 'Sem conexão com a internet. Verifique sua rede e tente novamente.';
    alertEl.classList.remove('hidden');
  } else toast('Sem conexão com a internet.', 'err');
  return true;
}

async function handleLogin(e){
  e.preventDefault();
  const form = e.target, err = $('#loginError');
  clearErrors(form); err.classList.add('hidden'); $('#loginSuccess').classList.add('hidden');
  if(offlineGuard(err)) return;
  const email = $('#loginEmail').value.trim().toLowerCase();
  const pass = $('#loginPass').value;
  const r = await api('entrar', { email, senha: pass, lembrar: $('#loginRemember').checked });
  if(!r.ok){
    err.textContent = r.erro === 'servidor'
      ? 'Não foi possível falar com o servidor. Verifique se o XAMPP está ligado.'
      : 'E-mail ou senha incorretos. Confira os dados e tente novamente.';
    err.classList.remove('hidden');
    $('#loginEmail').classList.add('invalid');
    $('#loginPass').classList.add('invalid');
    return;
  }
  $('#loginPass').value = '';
  enterApp(r.user);
}

async function handleRegister(e){
  e.preventDefault();
  const form = e.target; clearErrors(form);
  if(offlineGuard()) return;
  const name = $('#regName'), child = $('#regChild'), email = $('#regEmail'), p1 = $('#regPass'), p2 = $('#regPass2');
  let ok = true;
  if(!name.value.trim()){ setFieldError(name, 'Informe seu nome'); ok = false; }
  if(!child.value.trim()){ setFieldError(child, 'Informe o nome da criança'); ok = false; }
  const em = email.value.trim().toLowerCase();
  if(!isEmail(em)){ setFieldError(email, 'Informe um e-mail válido'); ok = false; }
  if(p1.value.length < 6){ setFieldError(p1, 'A senha deve ter pelo menos 6 caracteres'); ok = false; }
  if(p1.value !== p2.value || !p2.value){ setFieldError(p2, 'As senhas não são iguais'); ok = false; }
  if(!ok) return;
  const r = await api('cadastrar', { nome: name.value.trim(), crianca: child.value.trim(), email: em, senha: p1.value });
  if(r.erro === 'email'){ setFieldError(email, 'Este e-mail já está cadastrado. Informe outro.'); return; }
  if(!avisarFalha(r)) return;
  showAuth('login', { success: 'Conta criada com sucesso! Faça login para começar.', email: em });
  $('#loginPass').focus();
}

async function handleForgot(e){
  e.preventDefault();
  const form = e.target; clearErrors(form);
  if(offlineGuard()) return;
  const input = $('#forgotEmail');
  const em = input.value.trim().toLowerCase();
  if(!isEmail(em)){ setFieldError(input, 'Informe um e-mail válido'); return; }
  const r = await api('esqueci', { email: em });
  if(r.erro === 'servidor'){ avisarFalha(r); return; }
  if(!r.ok){ setFieldError(input, 'Não encontramos uma conta com este e-mail'); return; }
  resetEmail = em;
  $('#sentEmail').textContent = em;
  showAuth('sent');
}
async function handleReset(e){
  e.preventDefault();
  const form = e.target; clearErrors(form);
  const p1 = $('#resetPass'), p2 = $('#resetPass2');
  let ok = true;
  if(p1.value.length < 6){ setFieldError(p1); ok = false; }
  if(p1.value !== p2.value || !p2.value){ setFieldError(p2); ok = false; }
  if(!ok || !resetEmail) return;
  const r = await api('redefinir', { email: resetEmail, senha: p1.value });
  if(!avisarFalha(r)) return;
  const em = resetEmail; resetEmail = null;
  showAuth('login', { success: 'Senha alterada com sucesso! Entre com a nova senha.', email: em });
}

function enterApp(u){
  user = u;
  $('#auth').classList.add('hidden');
  $('#app').classList.remove('hidden');
  applySettings();
  renderHeader();

  showView(user.perfil ? 'home' : 'screening');
}

function applySettings(){
  document.body.classList.toggle('big-text', !!user.settings.bigText);
  if(user.settings.music) startMusic(); else stopMusic();
}

function renderHeader(bump = false){
  $('#coinCount').textContent = user.coins;
  $('#topName').textContent = user.childName;
  $('#topAvatar').innerHTML = AVATARS[user.avatar] || AVATARS.pessoa;
  $('#sideAvatar').innerHTML = AVATARS[user.avatar] || AVATARS.pessoa;
  if(bump){
    const p = $('#coinPill'); p.classList.remove('bump'); void p.offsetWidth; p.classList.add('bump');
  }
}

function showView(name, opts = {}){
  if(!user) return;
  window.speechSynthesis?.cancel();
  $$('.view').forEach(v => v.classList.remove('active'));
  $('#view-' + name).classList.add('active');
  $$('.nav-btn[data-view]').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  window.scrollTo(0, 0);
  ({
    home: renderHome,
    vocab: startVocab,
    phrase: startPhrase,
    commands: startCommands,
    story: startStory,
    screening: fillScreening,
    garden: renderGarden,
    stats: renderStats,
    achievements: () => renderBadges(opts.highlight),
    profile: fillProfile,
  })[name]?.();
}

function renderHome(){
  const c = todayCount();
  const plants = user.flowers.slice(-4);
  $('#homePlants').innerHTML = plants.map(f => FLOWERS[f](90)).join('');
  $('#homeGardenMsg').textContent = user.flowers.length
    ? 'Continue assim! Suas flores estão crescendo!'
    : 'Seu jardim está esperando a primeira flor!';

  let html = '';
  for(let i = 0; i < DAILY_GOAL; i++){
    const cls = i < c ? 'done' : (i === c ? 'current' : '');
    html += `<div class="dot ${cls}">${i < c ? ICONS.check : ''}</div>`;
    if(i < DAILY_GOAL - 1){
      const w = (i + 1) < c ? 100 : (i < c ? 60 : 0);
      html += `<div class="line"><span style="width:${w}%"></span></div>`;
    }
  }
  $('#homeProgress').innerHTML = html;
  $('#homeGoal').textContent = `Meta de hoje: ${Math.min(c, DAILY_GOAL)} de ${DAILY_GOAL} atividades`;

  const left = DAILY_GOAL - c;
  $('#homeMsg').textContent =
    c === 0 ? 'Escolha uma atividade para começarmos!' :
    left > 0 ? `Muito bem, ${user.childName}! ${left === 1 ? "Falta 1 atividade" : `Faltam ${left} atividades`} para a meta de hoje.` :
    `Uau, ${user.childName}! Você completou a meta de hoje!`;
}

const vocab = { queue: [], idx: 0, wrongNow: 0, firstTry: 0, errors: 0, locked: false };

function startVocab(){
  Object.assign(vocab, { queue: shuffle(WORDS).slice(0, WORDS_PER_ROUND), idx: 0, firstTry: 0, errors: 0 });
  renderVocabWord();
}
function renderVocabWord(){
  const target = vocab.queue[vocab.idx];
  vocab.wrongNow = 0; vocab.locked = false;
  const others = shuffle(WORDS.filter(w => w.key !== target.key)).slice(0, 2);
  const options = shuffle([target, ...others]);
  $('#vocabWord').textContent = target.word;
  $('#matchGrid').innerHTML = options.map(o =>
    `<button class="match-tile" data-key="${o.key}">${PICS[o.key]}<span>${o.label}</span></button>`).join('');
  $('#vocabDots').innerHTML = vocab.queue.map((_, i) =>
    `<span class="${i < vocab.idx ? 'done' : i === vocab.idx ? 'now' : ''}"></span>`).join('');
  const fb = $('#vocabFeedback');
  fb.className = 'feedback-bar';
  fb.textContent = `Palavra ${vocab.idx + 1} de ${vocab.queue.length} — escolha uma opção`;
  setTimeout(() => speak(target.label), 250);
}
function onVocabTile(tile){
  if(vocab.locked) return;
  const target = vocab.queue[vocab.idx];
  const fb = $('#vocabFeedback');
  if(tile.dataset.key === target.key){
    vocab.locked = true;
    tile.classList.add('correct');
    if(vocab.wrongNow === 0) vocab.firstTry++;
    fb.className = 'feedback-bar ok';
    fb.textContent = 'Muito bem! Sua flor cresceu um pouco mais.';
    sfx.ok(); speak('Muito bem!');
    $$('#matchGrid .match-tile').forEach(t => t.classList.add('disabled'));
    setTimeout(() => {
      vocab.idx++;
      if(vocab.idx < vocab.queue.length) renderVocabWord();
      else finishVocab();
    }, 1300);
  } else {
    vocab.wrongNow++; vocab.errors++;
    tile.classList.add('wrong', 'disabled');
    fb.className = 'feedback-bar bad';
    fb.textContent = 'Quase lá! Tente novamente.';
    sfx.bad(); speak('Quase lá! Tente novamente.');
  }
}
function finishVocab(){
  user.vocab.hits += vocab.firstTry;
  user.vocab.total += vocab.queue.length;
  $('#vocabDots').innerHTML = vocab.queue.map(() => '<span class="done"></span>').join('');
  const coins = Math.max(4, vocab.firstTry * 3 + 1);
  grantReward('vocab', coins, vocab.firstTry, vocab.queue.length);
}

const phrase = { item: null, order: [], placed: [], errors: 0, lastIdx: -1, locked: false };

function startPhrase(){
  let idx;
  do { idx = Math.floor(Math.random() * PHRASES.length); } while(PHRASES.length > 1 && idx === phrase.lastIdx);
  phrase.lastIdx = idx;
  phrase.item = PHRASES[idx];
  const n = phrase.item.words.length;
  let order;
  do { order = shuffle([...Array(n).keys()]); } while(order.every((v, i) => phrase.item.words[v] === phrase.item.words[i]));
  Object.assign(phrase, { order, placed: [], errors: 0, locked: false });
  const sentence = phrase.item.words.join(' ');
  $('#phraseTarget').innerHTML = `${SCENES[phrase.item.scene]}<span>Monte a frase: "${sentence}"</span>`;
  const fb = $('#phraseFeedback'); fb.className = 'feedback-bar'; fb.textContent = '';
  renderPhrase();
  setTimeout(() => speak('Monte a frase: ' + sentence), 250);
}
function renderPhrase(){
  const words = phrase.item.words;
  const zone = $('#dropZone');
  zone.className = 'drop-zone' + (phrase.placed.length ? '' : ' empty');
  zone.innerHTML = phrase.placed.map((i, pos) =>
    `<button class="word-block placed" data-pos="${pos}">${words[i]}</button>`).join('');
  $('#wordPool').innerHTML = phrase.order.map(i =>
    `<button class="word-block" data-i="${i}" ${phrase.placed.includes(i) ? 'disabled' : ''}>${words[i]}</button>`).join('');
  $('#btnCheckPhrase').disabled = phrase.placed.length !== words.length || phrase.locked;
}
function checkPhrase(){
  if(phrase.locked) return;
  const words = phrase.item.words;
  const built = phrase.placed.map(i => words[i]);
  const fb = $('#phraseFeedback'), zone = $('#dropZone');
  if(built.every((w, i) => w === words[i])){
    phrase.locked = true;
    zone.classList.add('ok');
    fb.className = 'feedback-bar ok';
    fb.textContent = 'Frase perfeita! O jardim ganhou uma nova flor.';
    sfx.ok(); speak(words.join(' '));
    $('#btnCheckPhrase').disabled = true;
    user.phrases++;
    const coins = Math.max(4, 10 - phrase.errors * 3);
    setTimeout(() => grantReward('phrase', coins, phrase.errors === 0 ? 1 : 0, 1), 1100);
  } else {
    phrase.errors++;
    zone.classList.add('bad');
    fb.className = 'feedback-bar bad';
    fb.textContent = 'Quase! A ordem ainda não está certa. Vamos tentar de novo.';
    sfx.bad(); speak('Quase! Vamos tentar de novo.');
    phrase.locked = true;
    setTimeout(() => { phrase.placed = []; phrase.locked = false; renderPhrase(); }, 1300);
  }
}

function grantReward(game, coins, acertos, total){
  const flower = FLOWER_CYCLE[user.flowers.length % FLOWER_CYCLE.length];
  user.coins += coins;
  user.flowers.push(flower);
  user.activities++;
  const k = dateKey();
  user.log[k] = (user.log[k] || 0) + 1;
  user.newFlower = true;

  const unlocked = BADGES.filter(b => !user.badges.includes(b.id) && b.test(user));
  unlocked.forEach(b => { user.badges.push(b.id); user.lastBadge = b.id; });
  api('atividade', { jogo: game, acertos, total, moedas: coins, flor: flower, conquistas: unlocked.map(b => b.id) }).then(avisarFalha);
  renderHeader(true);

  sfx.win();
  const text = {
    vocab: 'Você acertou as palavras e uma nova flor nasceu no seu jardim!',
    phrase: 'Você montou a frase e uma nova flor nasceu no seu jardim!',
    commands: 'Você seguiu os comandos da abelha e uma nova flor nasceu no seu jardim!',
    story: 'Você organizou a história e uma nova flor nasceu no seu jardim!',
  }[game];
  const m = openModal(`
    <div class="reward-art">
      <div class="coin">+${coins}</div>
      <div class="flower">${FLOWERS[['broto','muda','tulipa'].includes(flower) ? 'rosa' : flower](140)}</div>
    </div>
    <h2>Parabéns!</h2>
    <p>${text}</p>
    <div class="tags"><span class="tag gold">+${coins} moedas</span><span class="tag green">+1 flor no jardim</span></div>
    <button class="btn btn-green" id="mContinue">Continuar</button>
    <button class="btn btn-outline" id="mAgain">Jogar de novo</button>`);
  confetti(m);
  speak('Parabéns!');
  $('#mContinue').onclick = () => showBadgeQueue(unlocked, () => showView('home'));
  $('#mAgain').onclick = () => showBadgeQueue(unlocked, () => showView(game));
}
function showBadgeQueue(list, done){
  if(!list.length){ closeModal(); done(); return; }
  const [b, ...rest] = list;
  sfx.win();
  const m = openModal(`
    <div class="medal"><div>${ICONS[b.icon]}</div></div>
    <span class="tag purple">NOVA CONQUISTA</span>
    <h2>${b.name}</h2>
    <p>Incrível! ${b.msg} e ganhou uma nova medalha.</p>
    <button class="btn btn-purple" id="mSeeBadges">Ver minhas conquistas</button>
    <button class="btn btn-outline" id="mBadgeClose">Continuar</button>`);
  confetti(m);
  speak('Nova conquista! ' + b.name);
  $('#mSeeBadges').onclick = () => { closeModal(); showView('achievements', { highlight: b.id }); };
  $('#mBadgeClose').onclick = () => showBadgeQueue(rest, done);
}

function speakNow(text){
  const was = user.settings.voice; user.settings.voice = true;
  speak(text); user.settings.voice = was;
}
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const escapeHtml = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const cmd = { queue: [], idx: 0, step: 0, wrongNow: 0, firstTry: 0, errors: 0, locked: false };

function genCommand(tipo){
  const coresKeys = Object.keys(CORES);
  const objs = ['bola', 'estrela', 'flor', 'peixe', 'carro'];
  if(tipo === 'cor'){
    const o = pick(objs), alvo = pick(coresKeys);
    const outras = shuffle(coresKeys.filter(c => c !== alvo)).slice(0, 2);
    const outro = pick(objs.filter(x => x !== o));
    const tiles = shuffle([
      { id: 'a', svg: objetoSVG(o, alvo) },
      { id: 'b', svg: objetoSVG(o, outras[0]) },
      { id: 'c', svg: objetoSVG(o, outras[1]) },
      { id: 'd', svg: objetoSVG(outro, alvo) },
    ]);
    return { texto: `Toque ${art(o)} ${o} ${corNome(o, alvo)}.`, tiles, answer: ['a'] };
  }
  if(tipo === 'tamanho'){
    const o = pick(objs), [c1, c2] = shuffle(coresKeys).slice(0, 2);
    const tam = pick(['grande', 'pequeno']);
    const tiles = shuffle([
      { id: 'grande-' + c1, svg: objetoSVG(o, c1, 'grande') },
      { id: 'pequeno-' + c1, svg: objetoSVG(o, c1, 'pequeno') },
      { id: 'grande-' + c2, svg: objetoSVG(o, c2, 'grande') },
      { id: 'pequeno-' + c2, svg: objetoSVG(o, c2, 'pequeno') },
    ]);
    const tamTxt = tam === 'grande' ? 'grande' : pequeno(o);
    return { texto: `Toque ${art(o)} ${o} ${tamTxt} e ${corNome(o, c1)}.`, tiles, answer: [tam + '-' + c1] };
  }
  if(tipo === 'espacial'){
    const o = pick(['gato', 'bola', 'carro']), pos = pick(Object.keys(POSICOES));
    const cor = 'azul', outro = pick(['gato', 'bola', 'carro'].filter(x => x !== o));
    const tiles = shuffle([
      ...Object.keys(POSICOES).map(p => ({ id: p, svg: cenaMesaSVG(o, cor, p) })),
      { id: 'outro', svg: cenaMesaSVG(outro, 'vermelho', pos) },
    ]);
    return { texto: `Toque ${art(o)} ${o} que está ${POSICOES[pos]}.`, tiles, answer: [pos] };
  }

  const quatro = shuffle(objs).slice(0, 4);
  const cores = shuffle(coresKeys);
  const tiles = shuffle(quatro.map((o, i) => ({ id: o, svg: objetoSVG(o, cores[i]) })));
  const [o1, o2] = shuffle(quatro);
  return { texto: `Toque primeiro ${art(o1)} ${o1} e depois ${art(o2)} ${o2}.`, tiles, answer: [o1, o2] };
}
function startCommands(){
  Object.assign(cmd, { queue: ['cor', 'tamanho', 'espacial', 'duplo'].map(genCommand), idx: 0, firstTry: 0, errors: 0 });
  renderCommand();
}
function renderCommand(){
  const c = cmd.queue[cmd.idx];
  Object.assign(cmd, { step: 0, wrongNow: 0, locked: false });
  $('#cmdText').textContent = c.texto;
  $('#cmdGrid').innerHTML = c.tiles.map(t => `<button class="match-tile" data-id="${t.id}" aria-label="Figura">${t.svg}</button>`).join('');
  $('#cmdDots').innerHTML = cmd.queue.map((_, i) => `<span class="${i < cmd.idx ? 'done' : i === cmd.idx ? 'now' : ''}"></span>`).join('');
  const fb = $('#cmdFeedback'); fb.className = 'feedback-bar';
  fb.textContent = `Comando ${cmd.idx + 1} de ${cmd.queue.length}`;
  setTimeout(() => speak(c.texto), 250);
}
function onCmdTile(tile){
  if(cmd.locked) return;
  const c = cmd.queue[cmd.idx], fb = $('#cmdFeedback');
  if(tile.dataset.id === c.answer[cmd.step]){
    if(cmd.step < c.answer.length - 1){
      tile.insertAdjacentHTML('beforeend', `<span class="tile-order">${cmd.step + 1}</span>`);
      tile.classList.add('disabled');
      cmd.step++; sfx.tap();
      fb.className = 'feedback-bar ok'; fb.textContent = 'Isso! E agora?';
      return;
    }
    cmd.locked = true;
    if(c.answer.length > 1) tile.insertAdjacentHTML('beforeend', `<span class="tile-order">${cmd.step + 1}</span>`);
    tile.classList.add('correct');
    if(cmd.wrongNow === 0) cmd.firstTry++;
    fb.className = 'feedback-bar ok'; fb.textContent = 'Muito bem! Você seguiu o comando.';
    sfx.ok(); speak('Muito bem!');
    $$('#cmdGrid .match-tile').forEach(t => t.classList.add('disabled'));
    setTimeout(() => { cmd.idx++; cmd.idx < cmd.queue.length ? renderCommand() : finishCommands(); }, 1300);
  } else {
    cmd.wrongNow++; cmd.errors++;
    tile.classList.add('wrong');
    setTimeout(() => tile.classList.remove('wrong'), 700);
    if(cmd.step > 0){
      cmd.step = 0;
      $$('#cmdGrid .tile-order').forEach(s => s.remove());
      $$('#cmdGrid .match-tile').forEach(t => t.classList.remove('disabled'));
    }
    fb.className = 'feedback-bar bad'; fb.textContent = 'Quase! Ouça o comando de novo.';
    sfx.bad(); setTimeout(() => speak('Quase! ' + c.texto), 300);
  }
}
function finishCommands(){
  user.comandos.hits += cmd.firstTry;
  user.comandos.total += cmd.queue.length;
  $('#cmdDots').innerHTML = cmd.queue.map(() => '<span class="done"></span>').join('');
  grantReward('commands', Math.max(4, cmd.firstTry * 2 + 2), cmd.firstTry, cmd.queue.length);
}

const story = { h: null, order: [], slots: [], errors: 0, lastIdx: -1, locked: false, opts: [] };

function startStory(){
  let i;
  do { i = Math.floor(Math.random() * HISTORIAS.length); } while(HISTORIAS.length > 1 && i === story.lastIdx);
  story.lastIdx = i;
  let order;
  do { order = shuffle([0, 1, 2]); } while(order.every((v, k) => v === k));
  Object.assign(story, { h: HISTORIAS[i], order, slots: [], errors: 0, locked: false });
  $('#storyTitle').textContent = story.h.titulo;
  $('#storySentences').textContent = story.h.frases.join(' ');
  $('#storyStep1').classList.remove('hidden');
  $('#storyStep2').classList.add('hidden');
  const fb = $('#storyFeedback'); fb.className = 'feedback-bar'; fb.textContent = 'Toque nas cenas na ordem em que acontecem.';
  renderStory();
  setTimeout(() => speak(story.h.titulo + '. ' + story.h.frases.join(' ')), 300);
}
function renderStory(){
  const slotsEl = $('#storySlots');
  slotsEl.className = 'story-slots';
  slotsEl.innerHTML = [0, 1, 2].map(k => story.slots[k] != null
    ? `<button class="story-slot filled" data-pos="${k}" aria-label="Remover cena ${k + 1}">${cenaSVG(story.h.cenas[story.slots[k]])}<span>${k + 1}º</span></button>`
    : `<div class="story-slot">${k + 1}º</div>`).join('');
  $('#storyPool').innerHTML = story.order.map(i =>
    `<button class="story-card" data-i="${i}" aria-label="Cena" ${story.slots.includes(i) ? 'disabled' : ''}>${cenaSVG(story.h.cenas[i])}</button>`).join('');
  $('#btnCheckStory').disabled = story.slots.length !== 3 || story.locked;
}
function checkStory(){
  if(story.locked) return;
  const fb = $('#storyFeedback'), slotsEl = $('#storySlots');
  story.locked = true;
  if(story.slots.every((v, k) => v === k)){
    slotsEl.classList.add('ok');
    fb.className = 'feedback-bar ok'; fb.textContent = 'Isso! A história está na ordem certa.';
    sfx.ok(); speak('Isso! Agora me conte: sobre o que é a história?');
    setTimeout(showStoryQuestion, 1300);
  } else {
    story.errors++;
    slotsEl.classList.add('bad');
    fb.className = 'feedback-bar bad'; fb.textContent = 'Quase! Ouça a história de novo e tente outra vez.';
    sfx.bad(); speak('Quase! Vamos tentar de novo.');
    setTimeout(() => { story.slots = []; story.locked = false; renderStory(); }, 1400);
  }
}
function showStoryQuestion(){
  story.locked = false;
  $('#storyStep1').classList.add('hidden');
  $('#storyStep2').classList.remove('hidden');
  story.opts = shuffle(story.h.opcoes);
  $('#storyOptions').innerHTML = story.opts.map(o => `<button class="story-opt" data-opt="${o}">${o}</button>`).join('');
  const fb = $('#storyFeedback'); fb.className = 'feedback-bar'; fb.textContent = 'Escolha a resposta certa.';
}
function onStoryOption(btn){
  if(story.locked) return;
  const fb = $('#storyFeedback');
  if(btn.dataset.opt === story.h.opcoes[0]){
    story.locked = true;
    btn.classList.add('correct');
    fb.className = 'feedback-bar ok'; fb.textContent = 'Muito bem! Você entendeu a história.';
    sfx.ok();
    user.historias++;
    setTimeout(() => grantReward('story', Math.max(4, 10 - story.errors * 3), story.errors === 0 ? 1 : 0, 1), 1000);
  } else {
    story.errors++;
    btn.classList.add('wrong');
    setTimeout(() => btn.classList.remove('wrong'), 700);
    fb.className = 'feedback-bar bad'; fb.textContent = 'Quase! Pense no que aconteceu na história.';
    sfx.bad();
  }
}

function fillScreening(){
  const p = user.perfil || {};
  $('#scrDiag').innerHTML = Object.entries(DIAGNOSTICO).map(([k, t]) =>
    `<label class="opt"><input type="radio" name="diag" value="${k}" ${p.diagnostico === k ? 'checked' : ''}> ${t}</label>`).join('');
  $('#scrSinais').innerHTML = SINAIS.map((s, i) =>
    `<label class="opt"><input type="checkbox" value="${i}" ${(p.sinais || []).includes(i) ? 'checked' : ''}> ${s}</label>`).join('');
  $('#scrIdade').value = p.idade || user.childAge || '';
  $('#scrDiagErr').classList.remove('show');
  clearErrors($('#formScreening'));
}
function orientacao(p){
  const n = p.sinais.length;
  let titulo, texto;
  if(p.diagnostico === 'sim'){
    titulo = 'Tudo pronto!';
    texto = 'O TalkGarden pode complementar o acompanhamento fonoaudiológico da criança. Compartilhe as estatísticas de desempenho com o fonoaudiólogo que a acompanha.';
  } else if(p.diagnostico === 'avaliacao'){
    titulo = 'Tudo pronto!';
    texto = 'A criança já pode usar a plataforma enquanto a avaliação não termina. As estatísticas de desempenho podem ajudar o fonoaudiólogo a conhecer melhor as dificuldades dela.';
  } else if(n > 0){
    titulo = 'Fique atento(a)';
    texto = `Você marcou ${n} ${n === 1 ? 'sinal que merece' : 'sinais que merecem'} atenção. Isso não significa que a criança tem TDL — somente um fonoaudiólogo pode avaliar. Se as dificuldades persistirem, procure uma avaliação pela Unidade Básica de Saúde ou com o apoio da escola. Enquanto isso, a criança pode usar a plataforma normalmente.`;
  } else {
    titulo = 'Tudo pronto!';
    texto = 'A criança pode usar o TalkGarden para praticar vocabulário, frases, comandos e histórias. Se perceber dificuldades persistentes nas estatísticas, converse com a escola ou procure um fonoaudiólogo.';
  }
  if(p.idade < IDADE_MIN || p.idade > IDADE_MAX)
    texto += ` O TalkGarden foi pensado para crianças de ${IDADE_MIN} a ${IDADE_MAX} anos; para outras idades, use com o acompanhamento de um adulto.`;
  return { titulo, texto };
}
function saveScreening(e){
  e.preventDefault();
  const form = e.target; clearErrors(form);
  const diag = $('input[name="diag"]:checked', form);
  const idadeEl = $('#scrIdade'), idade = Number(idadeEl.value);
  let ok = true;
  $('#scrDiagErr').classList.toggle('show', !diag); if(!diag) ok = false;
  if(!idade || idade < 3 || idade > 14){ setFieldError(idadeEl); ok = false; }
  if(!ok){ toast('Responda as perguntas 1 e 3.', 'err'); return; }
  user.perfil = {
    diagnostico: diag.value,
    sinais: $$('#scrSinais input:checked').map(i => Number(i.value)),
    idade, data: Date.now(),
  };
  user.childAge = idade;
  api('questionario', user.perfil).then(avisarFalha);
  const o = orientacao(user.perfil);
  openModal(`
    <div data-bee></div>
    <h2>${o.titulo}</h2>
    <p>${o.texto}</p>
    <button class="btn btn-purple" id="mScrOk">Começar</button>`);
  $('#mScrOk').onclick = () => { closeModal(); showView('home'); };
}

function renderAlert(){
  const areas = [];
  const baixo = r => r.total >= ALERTA_MIN_RESPOSTAS && r.hits / r.total < ALERTA_ACERTO;
  if(baixo(user.vocab)) areas.push('no Jogo de Vocabulário');
  if(baixo(user.comandos)) areas.push('no Siga a Abelha');
  const box = $('#statsAlert');
  if(!areas.length){ box.innerHTML = ''; return; }
  const quem = user.perfil?.diagnostico === 'sim' ? 'com o fonoaudiólogo que acompanha a criança' : 'com a escola ou com um fonoaudiólogo';
  box.innerHTML = `<div class="alert-card"><span data-icon="alert"></span><div>
    <strong>Vale prestar atenção</strong>
    <p>${escapeHtml(user.childName)} acertou de primeira menos de ${Math.round(ALERTA_ACERTO * 100)}% das respostas ${areas.join(' e ')}. Isso não é um diagnóstico — dificuldades pontuais são normais —, mas, se continuarem, compartilhe estas estatísticas ${quem}.</p>
  </div></div>`;
  renderStatic(box);
}

function renderGarden(){
  const n = user.flowers.length;
  const pct = Math.min(100, Math.round(n / GARDEN_GOAL * 100));
  $('#gFlowers').textContent = n;
  $('#gStreak').textContent = streakOf(user);
  $('#gPercent').textContent = pct + '%';
  $('#gMeter').style.width = pct + '%';
  const box = $('#gardenPlants');
  if(!n){
    box.innerHTML = `<div class="empty-state">${FLOWERS.broto(70)}
      <div>Seu jardim ainda está vazio. Jogue a primeira atividade para plantar uma flor!</div>
      <button class="btn btn-green" data-view-link="vocab">Jogar agora</button></div>`;
    return;
  }
  box.innerHTML = user.flowers.map(f => FLOWERS[f](120)).join('');
  if(user.newFlower){
    box.lastElementChild?.classList.add('new');
    user.newFlower = false;
  }
}

function renderStats(){
  const v = user.vocab, c = user.comandos;
  const pct = r => (r.total ? Math.round(r.hits / r.total * 100) : 0) + '%';
  $('#sVocab').textContent = pct(v);
  $('#sCmd').textContent = pct(c);
  $('#sPhrases').textContent = user.phrases;
  $('#sStories').textContent = user.historias;
  $('#sDays').textContent = Object.values(user.log).filter(x => x > 0).length;
  $('#statsEmpty').classList.toggle('hidden', user.activities > 0);
  renderAlert();

  const names = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const today = new Date();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((today.getDay() + 6) % 7));
  const days = names.map((name, i) => {
    const d = new Date(monday); d.setDate(monday.getDate() + i);
    return { name, count: user.log[dateKey(d)] || 0, today: dateKey(d) === dateKey(today) };
  });
  const max = Math.max(DAILY_GOAL, ...days.map(d => d.count));
  $('#statsBars').innerHTML = days.map(d => `
    <div class="bar-row ${d.today ? 'today' : ''}">
      <div class="day">${d.name}</div>
      <div class="bar-track"><div class="bar-fill" style="width:0" data-w="${d.count / max * 100}"></div></div>
      <div class="count">${d.count} ativ.</div>
    </div>`).join('');
  requestAnimationFrame(() => $$('#statsBars .bar-fill').forEach(b => b.style.width = b.dataset.w + '%'));
}

function renderBadges(highlight){
  $('#badgeGrid').innerHTML = BADGES.map(b => {
    const got = user.badges.includes(b.id);
    if(got){
      const gold = b.id === (highlight || user.lastBadge) ? 'gold' : '';
      return `<div class="badge ${gold}"><div class="ring">${ICONS[b.icon]}</div><h4>${b.name}</h4><p>${b.desc}</p></div>`;
    }
    return `<button class="badge locked" data-badge="${b.id}" aria-label="${b.name}: ver como desbloquear">
      <div class="ring">${ICONS.lock}</div><h4>${b.name}</h4><p>Ainda bloqueado</p><div class="req">${b.req}</div></button>`;
  }).join('');
}

let pendingAvatar = 'pessoa';
function fillProfile(){
  const form = $('#formProfile'); clearErrors(form);
  $('#pName').value = user.name;
  $('#pChild').value = user.childName;
  $('#pEmail').value = user.email;
  $('#pAge').value = user.childAge || '';
  pendingAvatar = user.avatar;
  renderAvatarPick();
  $$('[data-setting]').forEach(cb => cb.checked = !!user.settings[cb.dataset.setting]);
  const p = user.perfil;
  $('#scrSummary').textContent = p
    ? `${DIAGNOSTICO[p.diagnostico]} · ${p.sinais.length} ${p.sinais.length === 1 ? 'sinal marcado' : 'sinais marcados'}`
    : 'Ainda não respondido';
}
function renderAvatarPick(){
  $('#avatarPick').innerHTML = Object.keys(AVATARS).map(k =>
    `<button type="button" class="avatar-opt ${k === pendingAvatar ? 'selected' : ''}" data-avatar="${k}" aria-label="Avatar ${k}">${AVATARS[k]}</button>`).join('');
}
async function saveProfile(e){
  e.preventDefault();
  const form = e.target; clearErrors(form);
  const name = $('#pName'), child = $('#pChild'), email = $('#pEmail'), age = $('#pAge');
  let ok = true;
  if(!name.value.trim()){ setFieldError(name, 'Este campo é obrigatório'); ok = false; }
  if(!child.value.trim()){ setFieldError(child, 'Este campo é obrigatório'); ok = false; }
  const em = email.value.trim().toLowerCase();
  if(!isEmail(em)){ setFieldError(email, 'Informe um e-mail válido'); ok = false; }
  const a = age.value.trim();
  if(a && (isNaN(a) || a < 2 || a > 14)){ setFieldError(age); ok = false; }
  if(!ok){ toast('Confira os campos destacados.', 'err'); $('.invalid', form)?.focus(); return; }
  if(offlineGuard()) return;

  const r = await api('perfil', { nome: name.value.trim(), crianca: child.value.trim(), email: em, idade: a, avatar: pendingAvatar });
  if(r.erro === 'email'){ setFieldError(email, 'Este e-mail já está cadastrado'); return; }
  if(!avisarFalha(r)) return;
  user.email = em;
  user.name = name.value.trim();
  user.childName = child.value.trim();
  user.childAge = a ? Number(a) : '';
  user.avatar = pendingAvatar;
  renderHeader();
  toast('Alterações salvas com sucesso!', 'ok');
}

function askLogout(){
  openModal(`
    <div data-bee></div>
    <h2>Já vai embora?</h2>
    <p>Seu jardim fica guardado. Volte logo para regar suas flores!</p>
    <div class="modal-row">
      <button class="btn btn-outline" id="mStay">Continuar jogando</button>
      <button class="btn btn-purple" id="mLeave">Sair</button>
    </div>`, { closeOnBackdrop: true });
  $('#mStay').onclick = closeModal;
  $('#mLeave').onclick = () => {
    closeModal();
    api('sair');
    window.speechSynthesis?.cancel();
    document.body.classList.remove('big-text');
    user = null;
    showAuth('login');
  };
}

function bindEvents(){
  $('#formLogin').addEventListener('submit', handleLogin);
  $('#formRegister').addEventListener('submit', handleRegister);
  $('#formForgot').addEventListener('submit', handleForgot);
  $('#formReset').addEventListener('submit', handleReset);
  $('#formProfile').addEventListener('submit', saveProfile);
  $('#btnCancelProfile').addEventListener('click', () => { fillProfile(); toast('Alterações descartadas.'); });
  $('#btnLogout').addEventListener('click', askLogout);
  $('#btnCheckPhrase').addEventListener('click', checkPhrase);
  $('#formScreening').addEventListener('submit', saveScreening);
  $('#btnCheckStory').addEventListener('click', checkStory);
  $('#btnClearStory').addEventListener('click', () => { if(story.locked) return; story.slots = []; renderStory(); });
  $('#cmdSpeak').addEventListener('click', () => speakNow(cmd.queue[cmd.idx]?.texto || ''));
  $('#storySpeak').addEventListener('click', () => story.h && speakNow(story.h.titulo + '. ' + story.h.frases.join(' ')));
  $('#btnClearPhrase').addEventListener('click', () => { if(phrase.locked) return; phrase.placed = []; renderPhrase(); });
  $('#vocabSpeak').addEventListener('click', () => speakNow(vocab.queue[vocab.idx]?.label || ''));
  $('#phraseSpeak').addEventListener('click', () => speakNow(phrase.item.words.join(' ')));
  $('#btnSendReset').addEventListener('click', () => {
    if(offlineGuard()) return;
    toast('Enviamos um link de redefinição para ' + user.email, 'ok');
  });

  document.addEventListener('click', e => {
    const go = e.target.closest('[data-go]');
    if(go){ e.preventDefault(); showAuth(go.dataset.go); return; }

    const nav = e.target.closest('.nav-btn[data-view]');
    if(nav){ showView(nav.dataset.view); return; }

    const link = e.target.closest('[data-view-link]');
    if(link){ closeModal(); showView(link.dataset.viewLink); return; }

    const tile = e.target.closest('#matchGrid .match-tile');
    if(tile){ onVocabTile(tile); return; }

    const cmdTile = e.target.closest('#cmdGrid .match-tile');
    if(cmdTile){ onCmdTile(cmdTile); return; }

    const storyCard = e.target.closest('#storyPool .story-card');
    if(storyCard && !storyCard.disabled && !story.locked && story.slots.length < 3){
      story.slots.push(Number(storyCard.dataset.i)); sfx.tap(); renderStory(); return;
    }
    const storySlot = e.target.closest('#storySlots .story-slot.filled');
    if(storySlot && !story.locked){
      story.slots.splice(Number(storySlot.dataset.pos), 1); sfx.tap(); renderStory(); return;
    }
    const storyOpt = e.target.closest('#storyOptions .story-opt');
    if(storyOpt){ onStoryOption(storyOpt); return; }

    const poolWord = e.target.closest('#wordPool .word-block');
    if(poolWord && !poolWord.disabled && !phrase.locked){
      phrase.placed.push(Number(poolWord.dataset.i)); sfx.tap();
      $('#phraseFeedback').textContent = ''; renderPhrase(); return;
    }
    const placedWord = e.target.closest('#dropZone .word-block');
    if(placedWord && !phrase.locked){
      phrase.placed.splice(Number(placedWord.dataset.pos), 1); sfx.tap(); renderPhrase(); return;
    }

    const badge = e.target.closest('.badge.locked');
    if(badge){ badge.classList.toggle('show-req'); return; }

    const av = e.target.closest('.avatar-opt');
    if(av){ pendingAvatar = av.dataset.avatar; renderAvatarPick(); return; }

    const eye = e.target.closest('.eye-btn');
    if(eye){
      const inp = document.getElementById(eye.dataset.eye);
      const show = inp.type === 'password';
      inp.type = show ? 'text' : 'password';
      eye.innerHTML = show ? ICONS.eyeOff : ICONS.eye;
      eye.setAttribute('aria-label', show ? 'Esconder senha' : 'Mostrar senha');
    }
  });

  document.addEventListener('input', e => {
    if(e.target.classList.contains('input')){
      e.target.classList.remove('invalid');
      e.target.closest('.field')?.classList.remove('has-error');
    }
  });

  $$('[data-setting]').forEach(cb => cb.addEventListener('change', () => {
    user.settings[cb.dataset.setting] = cb.checked;
    api('configuracoes', user.settings).then(avisarFalha); applySettings();
    if(cb.dataset.setting === 'sound' && cb.checked) sfx.ok();
    if(cb.dataset.setting === 'voice' && cb.checked) speak('Leitura em voz alta ligada!');
  }));

  window.addEventListener('offline', () => $('#offlineBanner').classList.remove('hidden'));
  window.addEventListener('online', () => {
    $('#offlineBanner').classList.add('hidden');
    toast('Conexão restabelecida!', 'ok');
  });

  document.addEventListener('keydown', e => { if(e.key === 'Escape' && $('#mStay')) closeModal(); });
}

async function init(){
  renderStatic();
  $$('.eye-btn').forEach(b => b.innerHTML = ICONS.eye);
  bindEvents();
  if(!navigator.onLine) $('#offlineBanner').classList.remove('hidden');
  const r = await api('sessao');
  if(r.ok) enterApp(r.user);
  else showAuth('login');
}
init();
