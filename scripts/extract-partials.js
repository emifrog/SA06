/**
 * extract-partials.js — Chantier 3.1 (factorisation header / footer)
 *
 * Étape unique (one-shot) :
 *  1. Extrait les blocs <header class="header"> et <footer id="pied-de-page">
 *     canoniques depuis index.html.
 *  2. Tokenise les chemins internes avec {{base}} (résolu au build selon la
 *     profondeur de la page).
 *  3. Écrit partials/header.html et partials/footer.html.
 *  4. Remplace dans toutes les pages partageant la signature canonique le bloc
 *     inline par un marqueur <!-- @include header --> / <!-- @include footer -->.
 *
 * Les pages au gabarit différent (ASA, 404, offline) ne sont pas touchées.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const HEADER_RE = /[ \t]*<header role="banner" class="header">[\s\S]*?<\/header>/;
const FOOTER_RE = /[ \t]*<footer id="pied-de-page" role="contentinfo" tabindex="-1" class="footer">[\s\S]*?<\/footer>/;

/** Remplace les chemins internes par des tokens {{base}}. */
function tokenize(block) {
  return block
    // Ancre vers la section accueil : doit fonctionner depuis n'importe quelle page
    .replace(/href="#sa06"/g, 'href="{{base}}index.html#sa06"')
    // Chemins relatifs/absolus vers /pages/
    .replace(/(href|src|action)="\.\/pages\//g, '$1="{{base}}pages/')
    .replace(/(href|src|action)="\/pages\//g, '$1="{{base}}pages/')
    .replace(/(href|src|action)="pages\//g, '$1="{{base}}pages/')
    // Ressources images
    .replace(/(href|src|action)="images\//g, '$1="{{base}}images/')
    // Accueil
    .replace(/(href|src|action)="index\.html"/g, '$1="{{base}}index.html"');
}

function extractBlock(html, re, label) {
  const m = html.match(re);
  if (!m) throw new Error(`Bloc ${label} introuvable dans index.html`);
  // Retire l'indentation de tête de la première ligne (laissée par [ \t]*)
  return m[0].replace(/^[ \t]+/, '');
}

// 1 + 2 + 3 : génération des partials depuis index.html
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const headerBlock = tokenize(extractBlock(indexHtml, HEADER_RE, 'header'));
const footerBlock = tokenize(extractBlock(indexHtml, FOOTER_RE, 'footer'));

fs.mkdirSync(path.join(ROOT, 'partials'), { recursive: true });
fs.writeFileSync(path.join(ROOT, 'partials', 'header.html'), headerBlock + '\n', 'utf8');
fs.writeFileSync(path.join(ROOT, 'partials', 'footer.html'), footerBlock + '\n', 'utf8');
console.log('✓ partials/header.html  (%d octets)', Buffer.byteLength(headerBlock));
console.log('✓ partials/footer.html  (%d octets)', Buffer.byteLength(footerBlock));

// 4 : remplacement dans les pages sources
function listHtml(dir, acc = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (['node_modules', '.git', 'dist', 'scripts', 'partials', '.vscode'].includes(e.name)) continue;
      listHtml(full, acc);
    } else if (e.name.endsWith('.html')) {
      acc.push(full);
    }
  }
  return acc;
}

let headerCount = 0;
let footerCount = 0;
for (const file of listHtml(ROOT)) {
  let html = fs.readFileSync(file, 'utf8');
  let changed = false;
  if (HEADER_RE.test(html)) {
    html = html.replace(HEADER_RE, '    <!-- @include header -->');
    headerCount++;
    changed = true;
  }
  if (FOOTER_RE.test(html)) {
    html = html.replace(FOOTER_RE, '    <!-- @include footer -->');
    footerCount++;
    changed = true;
  }
  if (changed) {
    fs.writeFileSync(file, html, 'utf8');
    console.log('  ↳ %s', path.relative(ROOT, file));
  }
}
console.log('✓ %d en-têtes et %d pieds de page remplacés par des marqueurs', headerCount, footerCount);
