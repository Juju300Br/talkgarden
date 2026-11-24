const CORES = {
  vermelho: { hex: '#E85454', m: 'vermelho', f: 'vermelha' },
  azul:     { hex: '#5B8DEF', m: 'azul', f: 'azul' },
  amarelo:  { hex: '#F5B92E', m: 'amarelo', f: 'amarela' },
  verde:    { hex: '#4FAF55', m: 'verde', f: 'verde' },
};

const OBJETOS = {
  bola:    { g: 'f', nome: 'bola',    svg: c => `<circle cx="32" cy="34" r="22" fill="${c}"/><path d="M10 34h44" stroke="#fff" stroke-width="4"/><circle cx="24" cy="24" r="4" fill="#fff" opacity=".5"/>` },
  estrela: { g: 'f', nome: 'estrela', svg: c => `<path d="M32 8l7.6 16.4L58 26.6 44.6 39.2 48 58 32 49 16 58l3.4-18.8L6 26.6l18.4-2.2z" fill="${c}" stroke="#00000022" stroke-width="2" stroke-linejoin="round"/>` },
  flor:    { g: 'f', nome: 'flor',    svg: c => `<path d="M32 60V36" stroke="#5D9E3B" stroke-width="4"/><g fill="${c}"><circle cx="32" cy="12" r="8"/><circle cx="21" cy="21" r="8"/><circle cx="43" cy="21" r="8"/><circle cx="25" cy="33" r="8"/><circle cx="39" cy="33" r="8"/></g><circle cx="32" cy="24" r="7" fill="${c === '#F5B92E' ? '#E85454' : '#F5B92E'}"/>` },
  peixe:   { g: 'm', nome: 'peixe',   svg: c => `<path d="M6 34c8-14 30-16 40 0-10 16-32 14-40 0z" fill="${c}"/><path d="M44 34l14-12v24z" fill="${c}" opacity=".85"/><circle cx="18" cy="31" r="3" fill="#2E2A20"/>` },
  carro:   { g: 'm', nome: 'carro',   svg: c => `<path d="M6 42v-8l8-2 8-10h20l10 10 6 2v8z" fill="${c}"/><path d="M24 24h8v8H17zM36 24h5l8 8H36z" fill="#DFF1FB"/><circle cx="18" cy="44" r="6" fill="#3A3550"/><circle cx="46" cy="44" r="6" fill="#3A3550"/>` },
  gato:    { g: 'm', nome: 'gato',    svg: () => `<path d="M14 16l8 12h20l8-12 2 22c0 12-9 20-20 20S12 50 12 38z" fill="#F2A65A"/><circle cx="25" cy="36" r="3" fill="#2E2A20"/><circle cx="39" cy="36" r="3" fill="#2E2A20"/><path d="M32 41l-3 3h6z" fill="#E85454"/>` },
};
const art = o => (OBJETOS[o].g === 'f' ? 'na' : 'no');
const corNome = (o, cor) => CORES[cor][OBJETOS[o].g];
const pequeno = o => (OBJETOS[o].g === 'f' ? 'pequena' : 'pequeno');

function objetoSVG(o, cor = 'vermelho', tam = 'grande') {
  const s = tam === 'grande' ? 1 : 0.55;
  const t = tam === 'grande' ? '' : ` transform="translate(${32 - 32 * s} ${64 - 64 * s}) scale(${s})"`;
  return `<svg viewBox="0 0 64 64"><g${t}>${OBJETOS[o].svg(CORES[cor].hex)}</g></svg>`;
}

function cenaMesaSVG(o, cor, pos) {
  const mesa = '<rect x="6" y="40" width="60" height="7" rx="2" fill="#B07A4A"/><rect x="9" y="47" width="5" height="29" fill="#8A5A34"/><rect x="58" y="47" width="5" height="29" fill="#8A5A34"/><path d="M0 76h100" stroke="#C9C3DE" stroke-width="2"/>';
  const at = { cima: 'translate(17 4) scale(.58)', baixo: 'translate(18 47) scale(.46)', lado: 'translate(68 47) scale(.46)' }[pos];
  return `<svg viewBox="0 0 100 80">${mesa}<g transform="${at}">${OBJETOS[o].svg(CORES[cor].hex)}</g></svg>`;
}
const POSICOES = { cima: 'em cima da mesa', baixo: 'embaixo da mesa', lado: 'ao lado da mesa' };
const COMANDOS_POR_RODADA = 4;

const CEU = (cor = '#DFF1FB') => `<rect width="120" height="90" rx="10" fill="${cor}"/>`;
const CHAO = '<path d="M0 70 Q60 60 120 70 V90 H0z" fill="#B8DE8F"/>';
const HISTORIAS = [
  { titulo: 'A sementinha',
    frases: ['Ana plantou uma semente na terra.', 'A chuva molhou a terra e nasceu um broto.', 'O broto cresceu e virou uma flor.'],
    cenas: [
      `${CEU()}${CHAO}<ellipse cx="60" cy="70" rx="22" ry="7" fill="#8A5A34"/><ellipse cx="60" cy="66" rx="5" ry="3.5" fill="#6B3E1E"/><path d="M76 34 q6 -8 12 0 l-4 20 h-6z" fill="#FFD3B0"/><path d="M64 60 l10 -8" stroke="#6B3E1E" stroke-width="1.5" stroke-dasharray="2 2"/>`,
      `${CEU('#CFE3F0')}${CHAO}<ellipse cx="60" cy="20" rx="24" ry="10" fill="#fff"/><g stroke="#5B8DEF" stroke-width="3" stroke-linecap="round"><path d="M46 34v8M60 34v8M74 34v8M53 46v6M67 46v6"/></g><ellipse cx="60" cy="70" rx="22" ry="7" fill="#8A5A34"/><path d="M60 68V56" stroke="#5D9E3B" stroke-width="3"/><ellipse cx="54" cy="56" rx="6" ry="3" fill="#79B84A"/><ellipse cx="66" cy="56" rx="6" ry="3" fill="#79B84A"/>`,
      `${CEU()}${CHAO}<circle cx="100" cy="16" r="9" fill="#FFC93C"/><ellipse cx="60" cy="72" rx="22" ry="6" fill="#8A5A34"/><path d="M60 70V34" stroke="#5D9E3B" stroke-width="3.5"/><ellipse cx="52" cy="52" rx="7" ry="3.5" fill="#79B84A"/><g fill="#F0577E"><circle cx="60" cy="18" r="7"/><circle cx="51" cy="25" r="7"/><circle cx="69" cy="25" r="7"/><circle cx="54" cy="34" r="7"/><circle cx="66" cy="34" r="7"/></g><circle cx="60" cy="27" r="6" fill="#F5B92E"/>`,
    ],
    opcoes: ['Uma semente que virou flor', 'Uma menina que foi à praia', 'Um carro que quebrou'] },
  { titulo: 'O pintinho',
    frases: ['A galinha botou um ovo no ninho.', 'O ovo começou a rachar.', 'Nasceu um pintinho amarelo.'],
    cenas: [
      `${CEU('#FFF4E0')}<path d="M20 70 q40 22 80 0" fill="#C9A26B"/><path d="M22 70 q38 -10 76 0" fill="#B07A4A"/><ellipse cx="60" cy="58" rx="12" ry="15" fill="#FFFDF5" stroke="#E6D9C2" stroke-width="2"/>`,
      `${CEU('#FFF4E0')}<path d="M20 70 q40 22 80 0" fill="#C9A26B"/><path d="M22 70 q38 -10 76 0" fill="#B07A4A"/><ellipse cx="60" cy="58" rx="12" ry="15" fill="#FFFDF5" stroke="#E6D9C2" stroke-width="2"/><path d="M50 52 l5 5 4 -6 4 6 5 -5" fill="none" stroke="#6B5A3A" stroke-width="2"/><path d="M42 40 l-6 -4 M78 40 l6 -4 M60 36 v-6" stroke="#F5B92E" stroke-width="2"/>`,
      `${CEU('#FFF4E0')}<path d="M20 70 q40 22 80 0" fill="#C9A26B"/><path d="M22 70 q38 -10 76 0" fill="#B07A4A"/><path d="M46 66 l4 -8 5 6 5 -7 5 7 5 -6 4 8z" fill="#FFFDF5" stroke="#E6D9C2"/><circle cx="60" cy="46" r="14" fill="#FFD54A"/><circle cx="60" cy="28" r="9" fill="#FFD54A"/><circle cx="57" cy="26" r="1.8" fill="#2E2A20"/><circle cx="64" cy="26" r="1.8" fill="#2E2A20"/><path d="M59 31 l3 2 -3 2z" fill="#FF8A3D"/>`,
    ],
    opcoes: ['O nascimento de um pintinho', 'Uma galinha que voou longe', 'Um ovo que caiu no chão'] },
  { titulo: 'O sorvete',
    frases: ['Léo ganhou um sorvete.', 'O sol estava muito quente.', 'O sorvete derreteu.'],
    cenas: [
      `${CEU()}<path d="M52 44 l8 34 8 -34z" fill="#E0A458"/><circle cx="60" cy="38" r="12" fill="#F7A6C4"/><circle cx="54" cy="32" r="3" fill="#fff" opacity=".6"/>`,
      `${CEU('#FFF0C9')}<circle cx="96" cy="18" r="11" fill="#FFC93C"/><g stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"><path d="M96 2v5M96 29v5M80 18h5M107 18h5M85 7l3 3M104 26l3 3M85 29l3-3M104 10l3-3"/></g><path d="M52 44 l8 34 8 -34z" fill="#E0A458"/><path d="M48 42 q12 -18 24 0 q-2 6 -4 4 q-2 6 -4 0 q-3 8 -6 0 q-3 6 -6 0 q-2 4 -4 -4z" fill="#F7A6C4"/>`,
      `${CEU('#FFF0C9')}<circle cx="96" cy="18" r="11" fill="#FFC93C"/><path d="M52 40 l8 34 8 -34z" fill="#E0A458"/><ellipse cx="60" cy="82" rx="24" ry="5" fill="#F7A6C4"/><path d="M56 42 q4 6 8 0" stroke="#F7A6C4" stroke-width="3" fill="none"/>`,
    ],
    opcoes: ['Um sorvete que derreteu no sol', 'Um menino que nadou no mar', 'Um sol que foi dormir'] },
  { titulo: 'Dia e noite',
    frases: ['O sol nasceu e o dia começou.', 'O sol ficou bem alto no céu.', 'O sol se pôs e a lua apareceu.'],
    cenas: [
      `${CEU('#FFE3C2')}<circle cx="60" cy="66" r="16" fill="#FFB347"/>${CHAO}`,
      `${CEU('#BFE3F7')}<circle cx="60" cy="20" r="13" fill="#FFC93C"/><g stroke="#F5A623" stroke-width="2.5" stroke-linecap="round"><path d="M60 1v5M60 34v5M41 20h5M74 20h5"/></g><ellipse cx="22" cy="34" rx="12" ry="5" fill="#fff"/>${CHAO}`,
      `${CEU('#2E2A50')}<path d="M70 12a14 14 0 1 0 10 24 12 12 0 0 1 -10 -24z" fill="#F5D76E"/><g fill="#fff"><circle cx="24" cy="18" r="1.6"/><circle cx="40" cy="30" r="1.2"/><circle cx="98" cy="40" r="1.6"/><circle cx="16" cy="42" r="1.2"/></g><path d="M0 70 Q60 60 120 70 V90 H0z" fill="#3E5A3A"/>`,
    ],
    opcoes: ['Um dia do começo ao fim', 'Uma chuva muito forte', 'Um passeio de carro'] },
];
const cenaSVG = c => `<svg viewBox="0 0 120 90">${c}</svg>`;

const SINAIS = [
  'Tem dificuldade para seguir instruções, não por desobediência, mas porque não entende bem o que foi dito.',
  'Tem dificuldade para aprender palavras novas ou para encontrar a palavra certa ao falar.',
  'Usa frases curtas ou com muitos erros de gramática para a idade.',
  'Conta histórias ou acontecimentos de forma desorganizada, difícil de acompanhar.',
  'Tem dificuldade para aprender a ler ou para entender o que lê.',
  'Começou a falar mais tarde que outras crianças.',
];
const DIAGNOSTICO = { sim: 'Sim, tem diagnóstico de TDL', avaliacao: 'Está em avaliação', nao: 'Não tem diagnóstico' };
const IDADE_MIN = 6, IDADE_MAX = 9;

const ALERTA_MIN_RESPOSTAS = 12, ALERTA_ACERTO = 0.6;

ICONS.ear = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9a6 6 0 1 1 12 0c0 3-2 4-3 6s-1 4-3.5 4A2.5 2.5 0 0 1 9 16.5"/><path d="M10 9a2 2 0 1 1 4 0c0 1.5-2 2-2 3.5"/></svg>';
ICONS.story = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="8.5" y="14" width="7" height="7" rx="1.5"/><path d="M10 7.5h4M12 11v3"/></svg>';
ICONS.alert = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v6M12 16.5v.5"/></svg>';
ICONS.clipboard = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/></svg>';
BADGES.push(
  { id: 'ouvinte', name: 'Bom ouvinte', desc: 'Acertou 20 comandos', req: 'Acerte 20 comandos no jogo Siga a Abelha', icon: 'ear',
    test: u => u.comandos.hits >= 20, msg: 'Você acertou 20 comandos da abelha' },
  { id: 'contador', name: 'Contador de histórias', desc: 'Organizou 10 histórias', req: 'Organize 10 histórias no jogo Conte a História', icon: 'story',
    test: u => u.historias >= 10, msg: 'Você organizou 10 histórias' },
);
