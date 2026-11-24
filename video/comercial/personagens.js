// Personagens do comercial: a criança Ju e a abelha (mesmo traço do TalkGarden)
const TINTA = '#3A3550';

// expressão: 'triste' | 'confusa' | 'feliz' | 'fala' | 'surpresa'
// braco: 'baixo' | 'aceno' | 'aponta'
function crianca({ expressao = 'feliz', braco = 'baixo', piscar = false, boca = 0 } = {}) {
  const olhos = piscar
    ? `<path d="M118 196q10 6 20 0M162 196q10 6 20 0" stroke="${TINTA}" stroke-width="4" fill="none" stroke-linecap="round"/>`
    : `<g><ellipse cx="128" cy="194" rx="11" ry="13" fill="${TINTA}"/><ellipse cx="172" cy="194" rx="11" ry="13" fill="${TINTA}"/>
       <circle cx="132" cy="189" r="4" fill="#fff"/><circle cx="176" cy="189" r="4" fill="#fff"/>
       <circle cx="125" cy="199" r="2" fill="#fff"/><circle cx="169" cy="199" r="2" fill="#fff"/></g>`;
  const sobr = {
    triste: `<path d="M114 172q12-8 24-2M162 170q12-6 24 2" stroke="${TINTA}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    confusa: `<path d="M114 170q12-6 24 0M162 166q12-10 24 0" stroke="${TINTA}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    feliz: `<path d="M115 172q12-9 24 0M161 172q12-9 24 0" stroke="${TINTA}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    fala: `<path d="M115 172q12-9 24 0M161 172q12-9 24 0" stroke="${TINTA}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    surpresa: `<path d="M115 166q12-10 24 0M161 166q12-10 24 0" stroke="${TINTA}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
  }[expressao];
  const abre = Math.max(0, Math.min(1, boca));
  const bocaSvg = {
    triste: `<path d="M140 232q10-8 20 0" stroke="${TINTA}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    confusa: `<path d="M138 232q6-5 12 0t12 0" stroke="${TINTA}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    feliz: `<path d="M136 226q14 14 28 0" stroke="${TINTA}" stroke-width="4" fill="#E8667E" stroke-linejoin="round"/>`,
    fala: `<ellipse cx="150" cy="${229 + abre * 2}" rx="${8 + abre * 3}" ry="${2 + abre * 9}" fill="#C9475F" stroke="${TINTA}" stroke-width="3"/>`,
    surpresa: `<ellipse cx="150" cy="232" rx="8" ry="10" fill="#C9475F" stroke="${TINTA}" stroke-width="3"/>`,
  }[expressao];

  const braçoEsq = `<path d="M96 318q-22 40-14 86" stroke="#F2C9A0" stroke-width="20" fill="none" stroke-linecap="round"/>`;
  const braçoDir = {
    baixo: `<path d="M204 318q22 40 14 86" stroke="#F2C9A0" stroke-width="20" fill="none" stroke-linecap="round"/>`,
    aceno: `<path d="M204 318q38-20 40-78" stroke="#F2C9A0" stroke-width="20" fill="none" stroke-linecap="round"/><circle cx="244" cy="232" r="15" fill="#F2C9A0"/>`,
    aponta: `<path d="M204 318q36 0 62-28" stroke="#F2C9A0" stroke-width="20" fill="none" stroke-linecap="round"/><circle cx="268" cy="286" r="13" fill="#F2C9A0"/>`,
  }[braco];

  return `<svg viewBox="0 0 300 520" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="150" cy="506" rx="96" ry="12" fill="#000" opacity=".08"/>
  <!-- pernas e tênis -->
  <rect x="116" y="410" width="26" height="74" rx="12" fill="#5B4FA8"/><rect x="158" y="410" width="26" height="74" rx="12" fill="#5B4FA8"/>
  <path d="M104 484q0-16 24-16h14v22h-34q-4 0-4-6z" fill="#fff" stroke="${TINTA}" stroke-width="3"/>
  <path d="M196 484q0-16-24-16h-14v22h34q4 0 4-6z" fill="#fff" stroke="${TINTA}" stroke-width="3"/>
  <!-- braços (atrás da camiseta) -->
  ${braçoEsq}${braçoDir}
  <!-- camiseta -->
  <path d="M100 300q50-26 100 0l10 120h-120z" fill="#6FBF73"/>
  <path d="M100 300q-14 8-20 34l26 8M200 300q14 8 20 34l-26 8" fill="#6FBF73"/>
  <g transform="translate(150 368)"><circle r="9" fill="#F5B92E"/>${[0, 72, 144, 216, 288].map(a => `<ellipse cx="0" cy="-15" rx="7" ry="9" fill="#fff" transform="rotate(${a})"/>`).join('')}<circle r="8" fill="#F5B92E"/></g>
  <!-- pescoço e cabeça -->
  <rect x="136" y="268" width="28" height="30" rx="10" fill="#E8B88E"/>
  <!-- cabelo atrás + chuquinhas -->
  <circle cx="64" cy="150" r="40" fill="#4A3426"/><circle cx="236" cy="150" r="40" fill="#4A3426"/>
  <circle cx="92" cy="150" r="9" fill="#B497E6"/><circle cx="208" cy="150" r="9" fill="#B497E6"/>
  <circle cx="150" cy="190" r="92" fill="#4A3426"/>
  <ellipse cx="150" cy="204" rx="80" ry="76" fill="#F2C9A0"/>
  <!-- franja -->
  <path d="M70 186q4-74 80-80q76 6 80 80q-26-38-80-40q-54 2-80 40z" fill="#4A3426"/>
  <!-- orelhas -->
  <ellipse cx="72" cy="210" rx="10" ry="14" fill="#E8B88E"/><ellipse cx="228" cy="210" rx="10" ry="14" fill="#E8B88E"/>
  <!-- rosto -->
  ${sobr}${olhos}
  <ellipse cx="112" cy="222" rx="13" ry="8" fill="#F7A6A6" opacity=".75"/><ellipse cx="188" cy="222" rx="13" ry="8" fill="#F7A6A6" opacity=".75"/>
  <path d="M148 212q3 4 6 0" stroke="#C98D66" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${bocaSvg}
</svg>`;
}

// asas: 0..1 (abertura do bater de asas)
function abelha({ asa = 1, sorriso = true, piscar = false } = {}) {
  const k = 0.35 + 0.65 * asa;
  const olhos = piscar
    ? `<path d="M31 26q3.5 3 7 0M42 26q3.5 3 7 0" stroke="#2E2A20" stroke-width="2" fill="none" stroke-linecap="round"/>`
    : `<circle cx="34.5" cy="26" r="3.2" fill="#2E2A20"/><circle cx="45.5" cy="26" r="3.2" fill="#2E2A20"/><circle cx="35.6" cy="24.8" r="1" fill="#fff"/><circle cx="46.6" cy="24.8" r="1" fill="#fff"/>`;
  return `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
    <defs><clipPath id="cpAb"><ellipse cx="40" cy="62" rx="16" ry="23"/></clipPath></defs>
    <g transform="translate(30 48) scale(1 ${k}) translate(-30 -48)"><ellipse cx="22" cy="46" rx="13" ry="18" fill="#CFEBF5" stroke="#9CCFE2" stroke-width="1" transform="rotate(-18 22 46)"/></g>
    <g transform="translate(50 48) scale(1 ${k}) translate(-50 -48)"><ellipse cx="58" cy="46" rx="13" ry="18" fill="#CFEBF5" stroke="#9CCFE2" stroke-width="1" transform="rotate(18 58 46)"/></g>
    <ellipse cx="40" cy="62" rx="16" ry="23" fill="#F5B92E"/>
    <g clip-path="url(#cpAb)" fill="#2E2A20"><rect x="27" y="36" width="4" height="52"/><rect x="35" y="36" width="4" height="52"/><rect x="43" y="36" width="4" height="52"/><rect x="51" y="36" width="4" height="52"/></g>
    <ellipse cx="40" cy="62" rx="16" ry="23" fill="none" stroke="#2E2A20" stroke-width="1.5"/>
    <path d="M33 16c-1-6-4-10-6-11M47 16c1-6 4-10 6-11" stroke="#2E2A20" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="27" cy="5" r="2.2" fill="#2E2A20"/><circle cx="53" cy="5" r="2.2" fill="#2E2A20"/>
    <circle cx="40" cy="28" r="15" fill="#F5B92E"/>
    ${olhos}
    ${sorriso ? '<path d="M33 32.5q7 6 14 0" stroke="#2E2A20" stroke-width="2.2" fill="none" stroke-linecap="round"/>' : '<ellipse cx="40" cy="34" rx="3" ry="2.6" fill="#2E2A20"/>'}
    <circle cx="29" cy="31" r="2.6" fill="#F7A6A6" opacity=".85"/><circle cx="51" cy="31" r="2.6" fill="#F7A6A6" opacity=".85"/>
  </svg>`;
}

if (typeof module !== 'undefined') module.exports = { crianca, abelha };
