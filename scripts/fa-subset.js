/**
 * fa-subset.js — Chantier 3.3 (allègement de Font Awesome)
 *
 * Génère un sous-ensemble auto-hébergé de Font Awesome 6.5.1 :
 *  - scanne les pages de dist/ pour repérer les icônes réellement utilisées ;
 *  - résout les alias FA5 (ex. fa-shield-alt → shield-halved) ;
 *  - sous-échantillonne les woff2 (solid + brands) aux seuls glyphes utilisés ;
 *  - écrit dist/fonts/fa/*.woff2 et dist/css/fa-subset.css.
 *
 * Remplace ainsi le all.min.css du CDN (~150 Ko + woff2 complets) par
 * quelques Ko, et supprime une requête bloquante tierce.
 */
const fs = require('fs');
const path = require('path');
const subsetFont = require('subset-font');

const FA_PKG = path.dirname(require.resolve('@fortawesome/fontawesome-free/package.json'));
const META = require('@fortawesome/fontawesome-free/metadata/icon-families.json');

// Classes utilitaires/styles à ignorer lors du scan (ne sont pas des icônes)
const NON_ICON = new Set([
  'solid', 'regular', 'brands', 'light', 'thin', 'duotone', 'sharp',
  'fw', 'spin', 'spin-pulse', 'pulse', 'beat', 'fade', 'flip', 'shake',
  'bounce', 'border', 'pull-left', 'pull-right', 'stack', 'stack-1x',
  'stack-2x', 'inverse', 'rotate-90', 'rotate-180', 'rotate-270',
  'flip-horizontal', 'flip-vertical', 'flip-both', 'xs', 'sm', 'lg',
  'xl', '2xl', '1x', '2x', '3x', '4x', '5x', '6x', '7x', '8x', '9x', '10x',
]);

// Carte alias FA5 -> nom canonique FA6
const ALIAS = {};
for (const [name, info] of Object.entries(META)) {
  const names = info.aliases && info.aliases.names;
  if (names) for (const a of names) ALIAS[a] = name;
}

function listHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) listHtml(full, acc);
    else if (e.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

/** @returns {Promise<{cssBytes:number, solid:number, brands:number}>} */
async function generate(distDir) {
  // 1. Scanner les icônes utilisées dans dist/
  const used = new Set();
  for (const file of listHtml(distDir)) {
    const html = fs.readFileSync(file, 'utf8');
    for (const m of html.matchAll(/\bfa-([a-z0-9-]+)/g)) used.add(m[1]);
  }

  // 2. Résoudre nom/unicode/style pour chaque icône
  const solid = []; // {cls, unicode}
  const brands = [];
  const seenContent = new Map(); // cls -> unicode (pour le CSS, alias inclus)
  for (const cls of used) {
    if (NON_ICON.has(cls)) continue;
    const canon = ALIAS[cls] || cls;
    const info = META[canon];
    if (!info || !info.unicode) continue; // pas une icône connue
    const styles = info.familyStylesByLicense.free.map((s) => s.style);
    const isBrand = styles.includes('brands');
    const bucket = isBrand ? brands : solid;
    if (!bucket.find((x) => x.unicode === info.unicode)) {
      bucket.push({ cls, unicode: info.unicode });
    }
    seenContent.set(cls, info.unicode); // conserve le nom tel qu'utilisé (alias compris)
  }

  // 3. Sous-échantillonner les woff2
  const outFontsDir = path.join(distDir, 'fonts', 'fa');
  fs.mkdirSync(outFontsDir, { recursive: true });

  async function subset(srcName, glyphs, outName) {
    if (!glyphs.length) return 0;
    const buf = fs.readFileSync(path.join(FA_PKG, 'webfonts', srcName));
    const text = glyphs.map((g) => String.fromCodePoint(parseInt(g.unicode, 16))).join('');
    const out = await subsetFont(buf, text, { targetFormat: 'woff2' });
    fs.writeFileSync(path.join(outFontsDir, outName), out);
    return out.length;
  }

  const solidBytes = await subset('fa-solid-900.woff2', solid, 'fa-solid-900.woff2');
  const brandsBytes = await subset('fa-brands-400.woff2', brands, 'fa-brands-400.woff2');

  // 4. Générer le CSS
  let css = '/* Font Awesome 6.5.1 — sous-ensemble auto-hébergé (généré par scripts/fa-subset.js) */';
  if (solid.length) {
    css += '@font-face{font-family:"Font Awesome 6 Free";font-style:normal;font-weight:900;font-display:block;src:url(../fonts/fa/fa-solid-900.woff2) format("woff2")}';
  }
  if (brands.length) {
    css += '@font-face{font-family:"Font Awesome 6 Brands";font-style:normal;font-weight:400;font-display:block;src:url(../fonts/fa/fa-brands-400.woff2) format("woff2")}';
  }
  css += '.fa,.fas,.fa-solid,.fab,.fa-brands{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:var(--fa-display,inline-block);font-style:normal;font-variant:normal;line-height:1;text-rendering:auto}';
  css += '.fa,.fas,.fa-solid{font-family:"Font Awesome 6 Free";font-weight:900}';
  css += '.fab,.fa-brands{font-family:"Font Awesome 6 Brands";font-weight:400}';
  css += '.fa-spin{animation:fa-spin 2s linear infinite}';
  css += '@keyframes fa-spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}';
  // Règles ::before par icône (noms tels qu'utilisés, alias compris)
  const contentRules = [...seenContent.entries()]
    .sort()
    .map(([cls, uni]) => `.fa-${cls}::before{content:"\\${uni}"}`)
    .join('');
  css += contentRules;

  const cssPath = path.join(distDir, 'css', 'fa-subset.css');
  fs.mkdirSync(path.dirname(cssPath), { recursive: true });
  fs.writeFileSync(cssPath, css, 'utf8');

  return {
    cssBytes: Buffer.byteLength(css),
    solid: solid.length,
    brands: brands.length,
    solidBytes,
    brandsBytes,
  };
}

module.exports = { generate };
