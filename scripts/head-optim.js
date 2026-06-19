// Optimisation des <head> : retire le doublon Font Awesome 6.4.0 et le preload
// redondant de style.css ; ajoute preconnect + preload des polices critiques.
// Idempotent : peut être relancé sans effet de bord.
const fs = require('fs');
const path = require('path');

function walk(dir) {
  let res = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue;
      res = res.concat(walk(p));
    } else if (e.name.endsWith('.html')) {
      res.push(p);
    }
  }
  return res;
}

const FONT400 = 'fonts/400.dab51d49a849b6d8f686.woff2';
const FONT700 = 'fonts/700.06b94e213fba202200b6.woff2';
const files = walk('.');
let changed = 0;

for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;

  const rel = path.relative('.', f).split(path.sep).join('/');
  const depth = rel.split('/').length - 1; // index.html=0, pages/x=1, pages/a/x=2
  const pre = '../'.repeat(depth);

  // 1. retirer le preload redondant de style.css
  s = s.replace(/[ \t]*<link rel="preload" href="[^"]*style\.css" as="style">\r?\n/, '');

  // 2. retirer le doublon Font Awesome 6.4.0 (on garde 6.5.1)
  s = s.replace(/[ \t]*<link rel="stylesheet" href="https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome\/6\.4\.0\/css\/all\.min\.css">\r?\n/, '');

  // 3. preconnect + preload des polices (si absent)
  if (!s.includes('rel="preconnect"')) {
    const block =
      '\n    <!-- Préconnexion aux origines tierces -->\n' +
      '    <link rel="preconnect" href="https://cdnjs.cloudflare.com" crossorigin>\n' +
      '    <link rel="preconnect" href="https://cdn.onesignal.com">\n' +
      '    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n' +
      '    <!-- Préchargement des polices critiques -->\n' +
      '    <link rel="preload" href="' + pre + FONT400 + '" as="font" type="font/woff2" crossorigin>\n' +
      '    <link rel="preload" href="' + pre + FONT700 + '" as="font" type="font/woff2" crossorigin>\n';
    s = s.replace(/(<meta name="viewport"[^>]*>\r?\n)/, '$1' + block);
  }

  if (s !== before) {
    fs.writeFileSync(f, s);
    changed++;
    console.log('MAJ', rel);
  }
}
console.log('Total modifié:', changed);
