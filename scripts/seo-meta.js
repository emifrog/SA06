// Ajoute/corrige canonical, Open Graph (type/url/image/site_name) et Twitter Cards
// sur les pages standard (celles possédant déjà une balise og:url). Idempotent.
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) { if (e.name === 'node_modules') continue; res = res.concat(walk(p)); }
    else if (e.name.endsWith('.html')) res.push(p);
  }
  return res;
}

const BASE = 'https://sa06.org/';
const OG_IMG = BASE + 'images/og-default.jpg';
const SKIP = new Set(['404.html', 'pages/offline.html', 'pages/search.html', 'scripts/generate-splash-screens.html']);
const NOINDEX = new Set(['pages/merci.html']);

let changed = 0;
for (const f of walk('.')) {
  const rel = path.relative('.', f).split(path.sep).join('/');
  if (SKIP.has(rel)) continue;
  let s = fs.readFileSync(f, 'utf8');
  if (!/property="og:url"/.test(s)) continue; // page sans bloc OG standard -> ignorée
  const before = s;

  const url = rel === 'index.html' ? BASE : BASE + rel;
  const isArticle = rel.startsWith('pages/actu/') && rel !== 'pages/actu.html';
  const ogType = isArticle ? 'article' : 'website';

  s = s.replace(/(<meta property="og:type" content=")[^"]*(">)/, `$1${ogType}$2`);
  s = s.replace(/(<meta property="og:url" content=")[^"]*(">)/, `$1${url}$2`);

  const ogt = (s.match(/property="og:title" content="([^"]*)"/) || [])[1] || '';
  const ogd = (s.match(/property="og:description"\s+content="([^"]*)"/) || [])[1] || '';

  if (!/rel="canonical"/.test(s)) {
    const block =
      `    <meta property="og:image" content="${OG_IMG}">\n` +
      `    <meta property="og:image:width" content="1200">\n` +
      `    <meta property="og:image:height" content="630">\n` +
      `    <meta property="og:image:alt" content="Syndicat Autonome 06 — SA06">\n` +
      `    <meta property="og:site_name" content="Syndicat Autonome 06">\n` +
      `    <meta property="og:locale" content="fr_FR">\n` +
      `    <link rel="canonical" href="${url}">\n` +
      `    <meta name="twitter:card" content="summary_large_image">\n` +
      `    <meta name="twitter:title" content="${ogt}">\n` +
      `    <meta name="twitter:description" content="${ogd}">\n` +
      `    <meta name="twitter:image" content="${OG_IMG}">\n`;
    s = s.replace(/(<meta property="og:url" content="[^"]*">\r?\n)/, `$1${block}`);
  }

  if (NOINDEX.has(rel) && !/name="robots"/.test(s)) {
    s = s.replace(/(<meta charset="UTF-8">\r?\n)/i, `$1    <meta name="robots" content="noindex, follow">\n`);
  }

  if (s !== before) { fs.writeFileSync(f, s); changed++; console.log('MAJ', rel); }
}
console.log('Total modifié:', changed);
