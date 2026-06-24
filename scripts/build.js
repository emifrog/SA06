/**
 * build.js — Pipeline de build statique du site SA06 (Phase 3).
 *
 * Sources : HTML/CSS/JS à la racine + pages/, css/, js/ … (édités normalement).
 * Sortie  : dist/ — dossier déployable tel quel sur sa06.org.
 *
 * Étapes :
 *  1. Nettoyage + copie des sources vers dist/.
 *  2. (3.1) Injection des partials header/footer (résolution {{base}} par profondeur).
 *  3. (3.3) Remplacement du CDN Font Awesome par un sous-ensemble auto-hébergé.
 *  4. (3.4) Purge du CSS inutilisé (PurgeCSS).
 *  5. (3.2) Minification CSS / JS / HTML.
 */
const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');
const { PurgeCSS } = require('purgecss');
const { minify: minifyHtml } = require('html-minifier-terser');
const faSubset = require('./fa-subset');

const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Entrées de premier niveau à NE PAS copier (artefacts de build / dev).
const EXCLUDE_TOP = new Set([
  'node_modules', '.git', '.vscode', '.gitignore', 'dist', 'scripts',
  'partials', 'package.json', 'package-lock.json',
  'PLAN-ACTION-AUDIT.md', 'PWA-README.md', 'README.md',
]);

const log = (...a) => console.log(...a);
const kb = (n) => (n / 1024).toFixed(1) + ' Ko';

function walk(dir, filter, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, filter, acc);
    else if (filter(full)) acc.push(full);
  }
  return acc;
}

const baseFor = (relPosix) => '../'.repeat(relPosix.split('/').length - 1);

async function build() {
  const t0 = Date.now();

  // 1. Nettoyage + copie ------------------------------------------------------
  fs.rmSync(DIST, { recursive: true, force: true });
  fs.mkdirSync(DIST, { recursive: true });
  for (const name of fs.readdirSync(ROOT)) {
    if (EXCLUDE_TOP.has(name) || name.endsWith('.md')) continue;
    fs.cpSync(path.join(ROOT, name), path.join(DIST, name), { recursive: true });
  }
  log('1. Sources copiées vers dist/');

  // 2 + 3. Injection des partials + remplacement du CDN Font Awesome ----------
  const header = fs.readFileSync(path.join(ROOT, 'partials', 'header.html'), 'utf8').trimEnd();
  const footer = fs.readFileSync(path.join(ROOT, 'partials', 'footer.html'), 'utf8').trimEnd();
  const FA_CDN_RE = /\s*<link[^>]*cdnjs\.cloudflare\.com\/ajax\/libs\/font-awesome[^>]*>/g;

  const htmlFiles = walk(DIST, (f) => f.endsWith('.html'));
  let includedHeader = 0;
  let includedFooter = 0;
  let faReplaced = 0;
  for (const file of htmlFiles) {
    const rel = path.relative(DIST, file).split(path.sep).join('/');
    const base = baseFor(rel);
    let html = fs.readFileSync(file, 'utf8');

    if (html.includes('<!-- @include header -->')) {
      html = html.replace(/[ \t]*<!-- @include header -->/g, header);
      includedHeader++;
    }
    if (html.includes('<!-- @include footer -->')) {
      html = html.replace(/[ \t]*<!-- @include footer -->/g, footer);
      includedFooter++;
    }
    // Résolution du token {{base}} pour cette page
    html = html.split('{{base}}').join(base);

    // Font Awesome : CDN -> sous-ensemble local
    if (FA_CDN_RE.test(html)) {
      html = html.replace(FA_CDN_RE, `\n    <link rel="stylesheet" href="${base}css/fa-subset.css">`);
      faReplaced++;
    }

    fs.writeFileSync(file, html, 'utf8');
  }
  log(`2. Partials injectés : ${includedHeader} en-têtes, ${includedFooter} pieds de page`);

  // 3b. Génération du sous-ensemble Font Awesome (après injection des icônes)
  const fa = await faSubset.generate(DIST);
  log(`3. Font Awesome : ${fa.solid} icônes solid + ${fa.brands} brands · `
    + `woff2 ${kb(fa.solidBytes + fa.brandsBytes)} · css ${kb(fa.cssBytes)} · `
    + `liens CDN remplacés sur ${faReplaced} pages`);

  // 4. PurgeCSS ---------------------------------------------------------------
  const cssFiles = walk(DIST, (f) => f.endsWith('.css') && !f.endsWith('fa-subset.css'));
  const purgeResults = await new PurgeCSS().purge({
    content: [
      { raw: htmlFiles.map((f) => fs.readFileSync(f, 'utf8')).join('\n'), extension: 'html' },
      ...walk(DIST, (f) => f.endsWith('.js')).map((f) => ({ raw: fs.readFileSync(f, 'utf8'), extension: 'js' })),
    ],
    css: cssFiles.map((f) => ({ raw: fs.readFileSync(f, 'utf8'), name: f })),
    safelist: {
      standard: ['active', 'visible', 'info-bubble', 'svg-loaded', 'mobile-menu-js-loaded', /^fa-/, /^fa$/],
      greedy: [/data-state/, /aria-/],
      keyframes: true,
      variables: true,
    },
  });
  let purgeBefore = 0;
  let purgeAfter = 0;
  purgeResults.forEach((res, i) => {
    const file = cssFiles[i];
    purgeBefore += fs.statSync(file).size;
    fs.writeFileSync(file, res.css, 'utf8');
    purgeAfter += Buffer.byteLength(res.css);
  });
  log(`4. PurgeCSS : ${kb(purgeBefore)} -> ${kb(purgeAfter)} avant minification`);

  // 5. Minification CSS / JS / HTML ------------------------------------------
  let cssBefore = 0;
  let cssAfter = 0;
  for (const file of walk(DIST, (f) => f.endsWith('.css'))) {
    const code = fs.readFileSync(file, 'utf8');
    cssBefore += Buffer.byteLength(code);
    const out = esbuild.transformSync(code, { loader: 'css', minify: true });
    fs.writeFileSync(file, out.code, 'utf8');
    cssAfter += Buffer.byteLength(out.code);
  }

  let jsBefore = 0;
  let jsAfter = 0;
  for (const file of walk(DIST, (f) => f.endsWith('.js'))) {
    const code = fs.readFileSync(file, 'utf8');
    jsBefore += Buffer.byteLength(code);
    try {
      const out = esbuild.transformSync(code, { loader: 'js', minify: true });
      fs.writeFileSync(file, out.code, 'utf8');
      jsAfter += Buffer.byteLength(out.code);
    } catch (e) {
      jsAfter += Buffer.byteLength(code);
      log(`   ! JS non minifié (${path.relative(DIST, file)}) : ${e.message.split('\n')[0]}`);
    }
  }

  let htmlBefore = 0;
  let htmlAfter = 0;
  const htmlSkipped = [];
  for (const file of htmlFiles) {
    const code = fs.readFileSync(file, 'utf8');
    htmlBefore += Buffer.byteLength(code);
    try {
      const out = await minifyHtml(code, {
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        keepClosingSlash: true,
        removeScriptTypeAttributes: false,
      });
      fs.writeFileSync(file, out, 'utf8');
      htmlAfter += Buffer.byteLength(out);
    } catch (e) {
      // HTML malformé (ex. guillemet brut dans un attribut title issu du CMS) :
      // on conserve la page non minifiée plutôt que de casser le build.
      htmlAfter += Buffer.byteLength(code);
      htmlSkipped.push(path.relative(DIST, file).split(path.sep).join('/'));
    }
  }

  log(`5. Minification :`);
  log(`     CSS  ${kb(cssBefore)} -> ${kb(cssAfter)}`);
  log(`     JS   ${kb(jsBefore)} -> ${kb(jsAfter)}`);
  log(`     HTML ${kb(htmlBefore)} -> ${kb(htmlAfter)}`);
  if (htmlSkipped.length) {
    log(`   ! HTML non minifié (source malformée) : ${htmlSkipped.join(', ')}`);
  }
  log(`\n✓ Build terminé en ${((Date.now() - t0) / 1000).toFixed(1)} s → dist/`);
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
