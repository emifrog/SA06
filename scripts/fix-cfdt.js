// Purge des vestiges du template CFDT : repointe les liens morts vers des pages
// réelles du site, supprime le branding « CFDT » visible et harmonise le domaine
// de partage sur sa06.org. (Le contenu éditorial résiduel des articles — fausses
// « cartes articles liés » — relève d'une relecture de contenu, non couverte ici.)
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

// Remplacements de liens (clé = sous-chaîne du href, valeur = cible racine-relative)
const LINKS = [
  ['https://www.facebook.com/sharer/sharer.php?u=https://www.cfdt.fr/adherer', 'https://www.facebook.com/sharer/sharer.php?u=https://sa06.org/pages/adherer.html'],
  ['body=https://saspp06.fr', 'body=https://sa06.org/pages/adherer.html'],
  ['qui-est-la-cfdt/les-revendications-de-la-cfdt/la-cfdt-en-10-points.html', '/pages/adherer.html'],
  ['qui-est-la-cfdt/les-revendications-de-la-cfdt.html', '/pages/actu.html'],
  ['qui-est-la-cfdt/les-valeurs-de-la-cfdt/les-valeurs-de-la-cfdt.html', '/pages/adherer.html'],
  ['espace-documentaire/index.html', '/plan-du-site.html'],
  ['espace-documentaire/index3eeb.html?t%5B0%5D=charte-graphique-et-logo', '/plan-du-site.html'],
  ['espace-documentaire/index5ea7.html?t%5B0%5D=livret-daccueil-des-adherents', '/plan-du-site.html'],
  ['espace-documentaire/indexadaf.html?t%5B0%5D=outils-dadhesion', '/plan-du-site.html'],
  ['espace-documentaire/indexbe24.html?t%5B0%5D=catalogue-des-produits-cfdt', '/plan-du-site.html'],
  ['espace-documentaire/indexdfa2.html?t%5B0%5D=petites-entreprises', '/plan-du-site.html'],
  ['/sinformer/la-cfdt-dans-les-medias/entretien-un-referendum-sur-la-justice-fiscale-cest-important-chacun-doit-participer-a-la-hauteur-de-ses-moyens', '/pages/media.html'],
  ['/sinformer/ressources-et-publications/dechiffrage-s-decouvrez-les-chiffres-cles-francais-europeens-et-de-quelques-grands-pays-du-monde', '/pages/actu.html'],
  ['/sinformer/web-tv/travail-vous-eric-comedien', '/pages/videos/videos.html'],
];

let totalLinks = 0, totalText = 0, files = 0;
for (const f of walk('.')) {
  let s = fs.readFileSync(f, 'utf8');
  const before = s;
  for (const [from, to] of LINKS) {
    const parts = s.split('href="' + from + '"');
    if (parts.length > 1) { totalLinks += parts.length - 1; s = parts.join('href="' + to + '"'); }
  }
  // Branding « CFDT » visible
  s = s.split('Mais aussi le catalogue CFDT !').join('Mais aussi nos ressources documentaires !');
  s = s.replace(/Catalogue des produits\s+CFDT<\/span>/g, 'Ressources documentaires</span>');
  if (s !== before) { fs.writeFileSync(f, s); files++; }
}

// Décompte du texte CFDT restant
let remaining = 0;
for (const f of walk('.')) {
  const m = fs.readFileSync(f, 'utf8').match(/cfdt/gi);
  if (m) remaining += m.length;
}
console.log('Liens repointés:', totalLinks, '| fichiers modifiés:', files);
console.log('Occurrences « cfdt » restantes (tous fichiers HTML):', remaining);
