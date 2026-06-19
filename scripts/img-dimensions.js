// Ajoute width/height (dimensions intrinsèques réelles) aux <img> qui n'en ont
// pas, pour réserver l'espace et supprimer le CLS. Le CSS continue de piloter la
// taille d'affichage ; les attributs ne servent qu'à fixer le ratio. Idempotent.
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

function walk(dir) {
  let res = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules') continue;
      res = res.concat(walk(p));
    } else if (e.name.endsWith('.html')) res.push(p);
  }
  return res;
}

async function dims(file) {
  try {
    const m = await sharp(file).metadata();
    if (m.width && m.height) return { w: m.width, h: m.height };
  } catch (_) {}
  return null;
}

(async () => {
  const files = walk('.');
  let totalImgs = 0, totalSkipRemote = 0, totalSkipMissing = 0;
  for (const f of files) {
    if (f.includes('generate-splash')) continue;
    let s = fs.readFileSync(f, 'utf8');
    const tags = s.match(/<img\b[^>]*>/gis) || [];
    let fileChanged = false;
    for (const tag of tags) {
      if (/\bwidth=/i.test(tag) || /\bheight=/i.test(tag)) continue; // a deja une dimension
      const m = tag.match(/\bsrc=["']([^"']+)["']/i);
      if (!m) continue;
      let src = m[1];
      if (/^(https?:)?\/\//i.test(src) || src.startsWith('data:')) { totalSkipRemote++; continue; }
      // resolution du chemin
      let abs = src.startsWith('/')
        ? path.join('.', src.slice(1))
        : path.join(path.dirname(f), src);
      if (!fs.existsSync(abs)) { totalSkipMissing++; console.log('  introuvable:', src, 'dans', f); continue; }
      const d = await dims(abs);
      if (!d) { totalSkipMissing++; continue; }
      const newTag = tag.replace(/<img\b/i, `<img width="${d.w}" height="${d.h}"`);
      s = s.replace(tag, newTag);
      fileChanged = true;
      totalImgs++;
    }
    if (fileChanged) { fs.writeFileSync(f, s); console.log('MAJ', path.relative('.', f).split(path.sep).join('/')); }
  }
  console.log(`\nImages dimensionnees: ${totalImgs} | ignorees (distantes/data): ${totalSkipRemote} | introuvables: ${totalSkipMissing}`);
})();
