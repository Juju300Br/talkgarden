/* =========================================================
   TalkGarden — dados fixos e desenhos (SVG)
   ========================================================= */

/* ---------- Ícones de interface ---------- */
const ICONS = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-8 9 8"/><path d="M5 10v10a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V10"/></svg>',
  sprout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22v-9"/><path d="M12 13c-4 0-7-3-7-7 4 0 7 3 7 7z"/><path d="M12 13c4 0 7-3 7-7-4 0-7 3-7 7z"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><rect x="7" y="12" width="3" height="6"/><rect x="12" y="8" width="3" height="10"/><rect x="17" y="5" width="3" height="13"/></svg>',
  medal:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5"/></svg>',
  logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  flame:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-5 5-5 8-1-1-2-2-2-4-2 2-2 5-2 8 0 4 3 7 7 7z"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z"/><path d="M8 11h8M8 14h5"/></svg>',
  book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19a2 2 0 0 0 2 2h13"/></svg>',
  coin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M11 10.5l2 1.5-2 1.5z" fill="currentColor"/></svg>',
  gear:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.56V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.56-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.56V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.56 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.51 1z"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
  next:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L19 7"/></svg>',
  eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
  eyeOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3l18 18"/><path d="M10.6 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.1M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a9.8 9.8 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
  speaker:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"/></svg>',
};

/* ---------- Abelha (mascote) ---------- */
let _beeId = 0;
function beeSVG(cls = 'bee'){
  const id = 'beeclip' + (++_beeId);
  return `<svg class="${cls}" viewBox="0 0 80 90" aria-hidden="true">
    <defs><clipPath id="${id}"><ellipse cx="40" cy="62" rx="16" ry="23"/></clipPath></defs>
    <ellipse cx="22" cy="52" rx="13" ry="18" fill="#CFEBF5" opacity=".8" transform="rotate(-18 22 52)"/>
    <ellipse cx="58" cy="52" rx="13" ry="18" fill="#CFEBF5" opacity=".8" transform="rotate(18 58 52)"/>
    <ellipse cx="40" cy="62" rx="16" ry="23" fill="#F5B92E"/>
    <g clip-path="url(#${id})" fill="#2E2A20">
      <rect x="27" y="36" width="4" height="52"/><rect x="35" y="36" width="4" height="52"/>
      <rect x="43" y="36" width="4" height="52"/><rect x="51" y="36" width="4" height="52"/>
    </g>
    <ellipse cx="40" cy="62" rx="16" ry="23" fill="none" stroke="#2E2A20" stroke-width="1.5"/>
    <path d="M33 16c-1-6-4-10-6-11M47 16c1-6 4-10 6-11" stroke="#2E2A20" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="40" cy="28" r="15" fill="#F5B92E"/>
    <circle cx="34.5" cy="26" r="3" fill="#2E2A20"/><circle cx="45.5" cy="26" r="3" fill="#2E2A20"/>
    <path d="M33 32.5q7 6 14 0" stroke="#2E2A20" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="29" cy="31" r="2.6" fill="#F7A6A6" opacity=".8"/><circle cx="51" cy="31" r="2.6" fill="#F7A6A6" opacity=".8"/>
  </svg>`;
}


/* ---------- Flores do jardim ---------- */
const FLOWERS = {
  broto:  (h=90)=>`<svg viewBox="0 0 40 90" height="${h}"><path d="M20 90V62" stroke="#5D9E3B" stroke-width="4" stroke-linecap="round"/><circle cx="20" cy="56" r="7" fill="#79B84A"/></svg>`,
  muda:   (h=90)=>`<svg viewBox="0 0 44 90" height="${h}"><path d="M22 90V54" stroke="#5D9E3B" stroke-width="4" stroke-linecap="round"/><ellipse cx="12" cy="54" rx="10" ry="6" fill="#79B84A"/><ellipse cx="32" cy="54" rx="10" ry="6" fill="#79B84A"/></svg>`,
  tulipa: (h=90)=>`<svg viewBox="0 0 40 90" height="${h}"><path d="M20 90V36" stroke="#5D9E3B" stroke-width="4" stroke-linecap="round"/><ellipse cx="20" cy="28" rx="10" ry="15" fill="#C9A8E8"/></svg>`,
  rosa:   (h=90)=>petalFlower('#F0577E','#F5B92E',h),
  azul:   (h=90)=>petalFlower('#7FB6E8','#F5B92E',h),
  amarela:(h=90)=>petalFlower('#F5B92E','#F0577E',h),
  lilas:  (h=90)=>petalFlower('#B497E6','#FFE08A',h),
};
function petalFlower(petal, center, h){
  return `<svg viewBox="0 0 48 90" height="${h}"><path d="M24 90V30" stroke="#5D9E3B" stroke-width="4" stroke-linecap="round"/><ellipse cx="15" cy="62" rx="8" ry="4" fill="#79B84A" transform="rotate(-20 15 62)"/><ellipse cx="33" cy="72" rx="8" ry="4" fill="#79B84A" transform="rotate(20 33 72)"/><g fill="${petal}"><circle cx="24" cy="12" r="8"/><circle cx="13" cy="20" r="8"/><circle cx="35" cy="20" r="8"/><circle cx="17" cy="31" r="8"/><circle cx="31" cy="31" r="8"/></g><circle cx="24" cy="22" r="6.5" fill="${center}"/></svg>`;
}
/* ordem em que as flores nascem no jardim */
const FLOWER_CYCLE = ['broto','muda','tulipa','rosa','azul','broto','amarela','muda','lilas','rosa','tulipa','azul','amarela','lilas'];
const GARDEN_GOAL = 20; // flores para o jardim ficar 100% completo

/* ---------- Desenhos das palavras (Jogo de Vocabulário) ---------- */
const PICS = {
  maca:'<svg viewBox="0 0 64 64"><path d="M32 18c-6-5-20-4-22 10-2 13 7 28 15 28 3 0 4-2 7-2s4 2 7 2c8 0 17-15 15-28-2-14-16-15-22-10z" fill="#E85454"/><path d="M32 18c0-5 1-9 5-12" stroke="#7A4A1E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M34 13c4-6 11-6 14-4-3 5-9 6-14 4z" fill="#6FBF73"/><ellipse cx="20" cy="30" rx="3" ry="6" fill="#fff" opacity=".45"/></svg>',
  casa:'<svg viewBox="0 0 64 64"><path d="M8 30L32 10l24 20" fill="#E85454"/><path d="M6 31L32 9l26 22" stroke="#C23B3B" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><rect x="13" y="29" width="38" height="27" fill="#FFD08A"/><rect x="27" y="39" width="10" height="17" fill="#8A5A34"/><rect x="16" y="34" width="8" height="8" fill="#BFE3F7"/><rect x="40" y="34" width="8" height="8" fill="#BFE3F7"/></svg>',
  bola:'<svg viewBox="0 0 64 64"><circle cx="32" cy="32" r="24" fill="#5B8DEF"/><path d="M8 32h48" stroke="#fff" stroke-width="4"/><path d="M32 8a30 30 0 0 1 0 48M32 8a30 30 0 0 0 0 48" stroke="#FFD54A" stroke-width="4" fill="none"/></svg>',
  sol:'<svg viewBox="0 0 64 64"><g stroke="#F5A623" stroke-width="4" stroke-linecap="round"><path d="M32 4v8M32 52v8M4 32h8M52 32h8M12 12l6 6M46 46l6 6M12 52l6-6M46 18l6-6"/></g><circle cx="32" cy="32" r="14" fill="#FFC93C"/><circle cx="27" cy="30" r="2" fill="#7A4A1E"/><circle cx="37" cy="30" r="2" fill="#7A4A1E"/><path d="M27 36q5 4 10 0" stroke="#7A4A1E" stroke-width="2" fill="none" stroke-linecap="round"/></svg>',
  gato:'<svg viewBox="0 0 64 64"><path d="M14 14l8 12h20l8-12 2 22c0 12-9 20-20 20S12 48 12 36z" fill="#F2A65A"/><circle cx="25" cy="34" r="3" fill="#2E2A20"/><circle cx="39" cy="34" r="3" fill="#2E2A20"/><path d="M32 39l-3 3h6z" fill="#E85454"/><path d="M14 40h10M14 45h10M40 40h10M40 45h10" stroke="#7A4A1E" stroke-width="1.5"/></svg>',
  flor:'<svg viewBox="0 0 64 64"><path d="M32 60V34" stroke="#5D9E3B" stroke-width="4" stroke-linecap="round"/><ellipse cx="23" cy="48" rx="8" ry="4" fill="#79B84A" transform="rotate(-25 23 48)"/><g fill="#F0577E"><circle cx="32" cy="12" r="8"/><circle cx="21" cy="21" r="8"/><circle cx="43" cy="21" r="8"/><circle cx="25" cy="33" r="8"/><circle cx="39" cy="33" r="8"/></g><circle cx="32" cy="24" r="7" fill="#F5B92E"/></svg>',
  peixe:'<svg viewBox="0 0 64 64"><path d="M6 32c8-14 30-16 40 0-10 16-32 14-40 0z" fill="#FF8A3D"/><path d="M44 32l14-12v24z" fill="#FF6B1A"/><circle cx="18" cy="29" r="3" fill="#2E2A20"/><path d="M26 22q4 10 0 20" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/></svg>',
  arvore:'<svg viewBox="0 0 64 64"><rect x="28" y="38" width="8" height="22" fill="#8A5A34"/><circle cx="32" cy="24" r="18" fill="#6FA83A"/><circle cx="20" cy="34" r="11" fill="#79B84A"/><circle cx="44" cy="34" r="11" fill="#79B84A"/></svg>',
  carro:'<svg viewBox="0 0 64 64"><path d="M6 40v-8l8-2 8-10h20l10 10 6 2v8z" fill="#E85454"/><path d="M24 22h8v8H17zM36 22h5l8 8H36z" fill="#BFE3F7"/><circle cx="18" cy="42" r="6" fill="#3A3550"/><circle cx="46" cy="42" r="6" fill="#3A3550"/><circle cx="18" cy="42" r="2.5" fill="#ddd"/><circle cx="46" cy="42" r="2.5" fill="#ddd"/></svg>',
  lua:'<svg viewBox="0 0 64 64"><path d="M40 8a24 24 0 1 0 16 38A20 20 0 0 1 40 8z" fill="#F5D76E"/><circle cx="28" cy="30" r="3" fill="#E6C14A"/><circle cx="34" cy="44" r="2" fill="#E6C14A"/></svg>',
  estrela:'<svg viewBox="0 0 64 64"><path d="M32 6l7.6 16.4L58 24.6 44.6 37.2 48 56 32 47 16 56l3.4-18.8L6 24.6l18.4-2.2z" fill="#FFC93C" stroke="#F5A623" stroke-width="2" stroke-linejoin="round"/></svg>',
  livro:'<svg viewBox="0 0 64 64"><path d="M8 14c8-3 16-3 24 2v40c-8-5-16-5-24-2z" fill="#7C6FCB"/><path d="M56 14c-8-3-16-3-24 2v40c8-5 16-5 24-2z" fill="#9C90E0"/><path d="M14 24c4-1 8-1 12 1M14 32c4-1 8-1 12 1M38 25c4-2 8-2 12-1M38 33c4-2 8-2 12-1" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>',
  cachorro:'<svg viewBox="0 0 64 64"><ellipse cx="14" cy="28" rx="7" ry="14" fill="#8A5A34"/><ellipse cx="50" cy="28" rx="7" ry="14" fill="#8A5A34"/><circle cx="32" cy="32" r="18" fill="#D9A066"/><circle cx="25" cy="29" r="3" fill="#2E2A20"/><circle cx="39" cy="29" r="3" fill="#2E2A20"/><ellipse cx="32" cy="39" rx="5" ry="4" fill="#2E2A20"/><path d="M32 43v4" stroke="#2E2A20" stroke-width="2"/><path d="M29 48q3 4 6 0" fill="#F0577E"/></svg>',
  pato:'<svg viewBox="0 0 64 64"><ellipse cx="36" cy="42" rx="20" ry="13" fill="#FFD54A"/><circle cx="22" cy="24" r="11" fill="#FFD54A"/><path d="M8 26l6-4 4 6z" fill="#FF8A3D"/><circle cx="20" cy="21" r="2.4" fill="#2E2A20"/><path d="M32 40q10 8 20-2" stroke="#F5B92E" stroke-width="3" fill="none" stroke-linecap="round"/></svg>',
};
const WORDS = [
  {key:'maca', word:'MAÇÃ', label:'Maçã'},
  {key:'casa', word:'CASA', label:'Casa'},
  {key:'bola', word:'BOLA', label:'Bola'},
  {key:'sol', word:'SOL', label:'Sol'},
  {key:'gato', word:'GATO', label:'Gato'},
  {key:'flor', word:'FLOR', label:'Flor'},
  {key:'peixe', word:'PEIXE', label:'Peixe'},
  {key:'arvore', word:'ÁRVORE', label:'Árvore'},
  {key:'carro', word:'CARRO', label:'Carro'},
  {key:'lua', word:'LUA', label:'Lua'},
  {key:'estrela', word:'ESTRELA', label:'Estrela'},
  {key:'livro', word:'LIVRO', label:'Livro'},
  {key:'cachorro', word:'CACHORRO', label:'Cachorro'},
  {key:'pato', word:'PATO', label:'Pato'},
];
const WORDS_PER_ROUND = 3;

/* ---------- Imagens de apoio (Formando Frases) ---------- */
const SCENES = {
  gatoSofa:'<svg viewBox="0 0 110 72"><rect x="14" y="34" width="82" height="22" rx="8" fill="#9C90E0"/><rect x="8" y="26" width="16" height="32" rx="7" fill="#7C6FCB"/><rect x="86" y="26" width="16" height="32" rx="7" fill="#7C6FCB"/><rect x="18" y="56" width="5" height="10" fill="#5B4FA8"/><rect x="87" y="56" width="5" height="10" fill="#5B4FA8"/><ellipse cx="54" cy="31" rx="22" ry="9" fill="#F2A65A"/><circle cx="34" cy="27" r="9" fill="#F2A65A"/><path d="M27 21l2-8 5 6zM36 19l4-7 2 8z" fill="#F2A65A"/><path d="M30 27q2 2 4 0M36 27q2 2 4 0" stroke="#7A4A1E" stroke-width="1.4" fill="none"/><path d="M76 30q10-2 8-12" stroke="#F2A65A" stroke-width="5" fill="none" stroke-linecap="round"/><text x="44" y="12" font-size="9" fill="#7A7590" font-family="sans-serif" font-weight="700">z z</text></svg>',
  solCeu:'<svg viewBox="0 0 110 72"><rect width="110" height="72" rx="12" fill="#DFF1FB"/><g stroke="#F5A623" stroke-width="3" stroke-linecap="round"><path d="M55 8v6M55 58v6M27 36h6M77 36h6M35 16l4 4M71 52l4 4M35 56l4-4M71 20l4-4"/></g><circle cx="55" cy="36" r="15" fill="#FFC93C"/><circle cx="50" cy="34" r="2" fill="#7A4A1E"/><circle cx="60" cy="34" r="2" fill="#7A4A1E"/><path d="M50 40q5 4 10 0" stroke="#7A4A1E" stroke-width="2" fill="none" stroke-linecap="round"/><ellipse cx="90" cy="20" rx="12" ry="6" fill="#fff"/><ellipse cx="18" cy="54" rx="12" ry="6" fill="#fff"/></svg>',
  peixeMar:'<svg viewBox="0 0 110 72"><rect width="110" height="72" rx="12" fill="#BFE3F7"/><path d="M0 50q14-8 28 0t28 0 28 0 26 0V72H0z" fill="#7FB6E8"/><path d="M26 34c8-12 28-14 38 0-10 14-30 12-38 0z" fill="#FF8A3D"/><path d="M62 34l12-10v20z" fill="#FF6B1A"/><circle cx="36" cy="31" r="2.6" fill="#2E2A20"/><circle cx="86" cy="20" r="3" fill="#fff" opacity=".8"/><circle cx="92" cy="12" r="2" fill="#fff" opacity=".8"/></svg>',
  abelhaFlor:'<svg viewBox="0 0 110 72"><rect width="110" height="72" rx="12" fill="#F1F7E4"/><path d="M34 72V40" stroke="#5D9E3B" stroke-width="4"/><g fill="#F0577E"><circle cx="34" cy="22" r="8"/><circle cx="23" cy="30" r="8"/><circle cx="45" cy="30" r="8"/><circle cx="27" cy="41" r="8"/><circle cx="41" cy="41" r="8"/></g><circle cx="34" cy="32" r="7" fill="#F5B92E"/><ellipse cx="72" cy="20" rx="7" ry="9" fill="#CFEBF5"/><ellipse cx="84" cy="20" rx="7" ry="9" fill="#CFEBF5"/><ellipse cx="78" cy="32" rx="12" ry="9" fill="#F5B92E"/><path d="M74 24v16M80 23v18" stroke="#2E2A20" stroke-width="3"/><circle cx="88" cy="30" r="2" fill="#2E2A20"/><path d="M50 40q10-6 16-10" stroke="#7A7590" stroke-width="1.5" stroke-dasharray="3 3" fill="none"/></svg>',
  cachorroBola:'<svg viewBox="0 0 110 72"><rect width="110" height="72" rx="12" fill="#EAF6DD"/><rect y="52" width="110" height="20" rx="0" fill="#BFE0A0"/><ellipse cx="22" cy="30" rx="5" ry="10" fill="#8A5A34"/><ellipse cx="46" cy="30" rx="5" ry="10" fill="#8A5A34"/><circle cx="34" cy="34" r="14" fill="#D9A066"/><circle cx="29" cy="31" r="2.4" fill="#2E2A20"/><circle cx="39" cy="31" r="2.4" fill="#2E2A20"/><ellipse cx="34" cy="38" rx="4" ry="3" fill="#2E2A20"/><circle cx="80" cy="44" r="12" fill="#5B8DEF"/><path d="M68 44h24" stroke="#fff" stroke-width="3"/><path d="M58 30h8M60 38h6" stroke="#7A7590" stroke-width="2" stroke-linecap="round"/></svg>',
  meninaLivro:'<svg viewBox="0 0 110 72"><rect width="110" height="72" rx="12" fill="#FCEBF0"/><circle cx="55" cy="22" r="12" fill="#FFD3B0"/><path d="M42 22c0-12 26-12 26 0-4-6-22-6-26 0z" fill="#7A4A1E"/><circle cx="51" cy="22" r="1.8" fill="#2E2A20"/><circle cx="59" cy="22" r="1.8" fill="#2E2A20"/><path d="M51 27q4 3 8 0" stroke="#2E2A20" stroke-width="1.5" fill="none"/><path d="M40 72c0-18 6-26 15-26s15 8 15 26z" fill="#F0577E"/><path d="M36 48c6-2 12-2 19 2v14c-7-4-13-4-19-2z" fill="#7C6FCB"/><path d="M74 48c-6-2-12-2-19 2v14c7-4 13-4 19-2z" fill="#9C90E0"/></svg>',
};
const PHRASES = [
  {words:['O','gato','dorme','no','sofá'], scene:'gatoSofa'},
  {words:['O','sol','brilha','no','céu'], scene:'solCeu'},
  {words:['O','peixe','nada','no','mar'], scene:'peixeMar'},
  {words:['A','abelha','voa','na','flor'], scene:'abelhaFlor'},
  {words:['O','cachorro','pega','a','bola'], scene:'cachorroBola'},
  {words:['A','menina','lê','o','livro'], scene:'meninaLivro'},
];

/* ---------- Avatares ---------- */
const AVATARS = {
  pessoa:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="url(#avg)"/><defs><linearGradient id="avg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD3B0"/><stop offset="1" stop-color="#FFB27A"/></linearGradient></defs><circle cx="24" cy="19" r="6.5" fill="none" stroke="#7A4A1E" stroke-width="2.6"/><path d="M12.5 36c1.5-6 6-8.5 11.5-8.5s10 2.5 11.5 8.5" fill="none" stroke="#7A4A1E" stroke-width="2.6" stroke-linecap="round"/></svg>',
  abelha:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#FFF1C9"/><ellipse cx="15" cy="24" rx="6" ry="8" fill="#CFEBF5"/><ellipse cx="33" cy="24" rx="6" ry="8" fill="#CFEBF5"/><ellipse cx="24" cy="30" rx="8" ry="10" fill="#F5B92E"/><path d="M19 23v16M24 21v19M29 23v16" stroke="#2E2A20" stroke-width="2.4"/><circle cx="24" cy="16" r="7" fill="#F5B92E"/><circle cx="21.5" cy="15" r="1.5" fill="#2E2A20"/><circle cx="26.5" cy="15" r="1.5" fill="#2E2A20"/><path d="M20 8l2 3M28 8l-2 3" stroke="#2E2A20" stroke-width="1.5" stroke-linecap="round"/></svg>',
  flor:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#EAF6DD"/><path d="M24 42V22" stroke="#5D9E3B" stroke-width="2.6"/><g fill="#F0577E"><circle cx="24" cy="10" r="4.5"/><circle cx="18" cy="15" r="4.5"/><circle cx="30" cy="15" r="4.5"/><circle cx="20" cy="21" r="4.5"/><circle cx="28" cy="21" r="4.5"/></g><circle cx="24" cy="16" r="3.6" fill="#F5B92E"/></svg>',
  estrela:'<svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#E3F0FB"/><path d="M24 11l3.9 8.3 9.1 1.1-6.7 6.3 1.7 9.1L24 31.4l-8 4.4 1.7-9.1-6.7-6.3 9.1-1.1z" fill="#F5B92E"/></svg>',
};

/* ---------- Medalhas / conquistas ---------- */
const BADGES = [
  {id:'primeiro', name:'Primeiro passo', desc:'Concluiu a 1ª atividade', req:'Conclua sua primeira atividade', icon:'medal',
   test:u=>u.activities>=1, msg:'Você concluiu sua primeira atividade'},
  {id:'florido', name:'Jardim florido', desc:'5 flores plantadas', req:'Plante 5 flores no seu jardim', icon:'sprout',
   test:u=>u.flowers.length>=5, msg:'Você plantou 5 flores no jardim'},
  {id:'sequencia', name:'Sequência de 7 dias', desc:'Jogou 7 dias seguidos', req:'Jogue 7 dias seguidos', icon:'flame',
   test:u=>streakOf(u)>=7, msg:'Você jogou 7 dias seguidos'},
  {id:'mestre', name:'Mestre das frases', desc:'Montou 25 frases', req:'Monte 25 frases no jogo Formando Frases', icon:'chat',
   test:u=>u.phrases>=25, msg:'Você montou 25 frases'},
  {id:'palavras', name:'Caçador de palavras', desc:'Acertou 50 palavras', req:'Acerte 50 palavras no Jogo de Vocabulário', icon:'book',
   test:u=>u.vocab.hits>=50, msg:'Você acertou 50 palavras'},
  {id:'cofrinho', name:'Cofrinho cheio', desc:'Juntou 300 moedas', req:'Junte 300 moedas', icon:'coin',
   test:u=>u.coins>=300, msg:'Você juntou 300 moedas'},
];
