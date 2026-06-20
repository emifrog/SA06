// Corrige les liens internes .html cassés : si un href relatif ne pointe vers
// aucun fichier existant, on le réécrit en chemin racine-relatif (/pages/...)
// vers le fichier de même nom (s'il est unique). Ne touche jamais aux liens qui
// résolvent déjà correctement, ni aux liens externes/#/mailto/root-relatifs.
// index.html est exclu de la réparation par basename (ambiguïté des vestiges).
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

const files = walk('.');
const relAll = files.map(f => path.relative('.', f).split(path.sep).join('/'));
const byBase = {};
for (const rf of relAll) {
  const b = rf.split('/').pop();
  (byBase[b] = byBase[b] || []).push(rf);
}

const changes = [];
for (const f of files) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  s = s.replace(/href="([^"#][^"]*\.html)"/g, (m, href) => {
    if (/^(https?:)?\/\//i.test(href) || href.startsWith('/') || href.startsWith('mailto:')) return m;
    const abs = path.resolve(path.dirname(f), href);
    if (fs.existsSync(abs)) return m; // lien correct -> on ne touche pas
    const base = href.split('/').pop();
    if (base === 'index.html') return m; // exclusion volontaire
    const matches = byBase[base] || [];
    if (matches.length === 1) {
      const fixed = '/' + matches[0];
      changes.push([path.relative('.', f).split(path.sep).join('/'), href, fixed]);
      return `href="${fixed}"`;
    }
    return m; // pas de réparation sûre
  });
  if (s !== before) fs.writeFileSync(f, s);
}

for (const [file, from, to] of changes) console.log(`${file}\n   ${from}  ->  ${to}`);
console.log('\nLiens réparés:', changes.length);
