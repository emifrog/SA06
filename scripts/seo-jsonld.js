// Injecte des données structurées Schema.org (JSON-LD) :
//  - Organization sur l'accueil
//  - NewsArticle + BreadcrumbList sur les articles d'actualité
//  - FAQPage sur la FAQ
// Idempotent : n'injecte pas si un bloc ld+json existe déjà dans la page.
const fs = require('fs');

const BASE = 'https://sa06.org/';
const LOGO = BASE + 'images/logo-512x512.png';
const PUBLISHER = {
  '@type': 'Organization',
  name: 'Syndicat Autonome 06',
  logo: { '@type': 'ImageObject', url: LOGO },
};

function ld(obj) {
  return '    <script type="application/ld+json">\n' +
    JSON.stringify(obj, null, 2).split('\n').map(l => '    ' + l).join('\n') +
    '\n    </script>\n';
}

function injectBeforeHead(file, blocks) {
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('application/ld+json')) { console.log('DEJA présent', file); return; }
  s = s.replace(/(\s*)<\/head>/i, '\n' + blocks + '$1</head>');
  fs.writeFileSync(file, s);
  console.log('MAJ', file);
}

// 1. Organization sur l'accueil (après le manifest)
{
  const file = 'index.html';
  let s = fs.readFileSync(file, 'utf8');
  if (s.includes('application/ld+json')) {
    console.log('DEJA présent', file);
  } else {
    const org = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Syndicat Autonome 06',
      alternateName: 'SA06',
      url: BASE,
      logo: LOGO,
      description: "Syndicat Autonome 06, 1ère force syndicale du SDIS 06, au service des sapeurs-pompiers et personnels administratifs et techniques.",
      areaServed: { '@type': 'AdministrativeArea', name: 'Alpes-Maritimes (06)' },
      sameAs: [
        'https://www.facebook.com/saspppats06',
        'https://x.com/Faspp06',
        'https://www.instagram.com/saspp06/',
        'https://www.tiktok.com/@saspp06',
        'https://www.youtube.com/@saspp06',
      ],
    };
    s = s.replace(/(<link rel="manifest" href="manifest\.json">\r?\n)/, '$1' + ld(org));
    fs.writeFileSync(file, s);
    console.log('MAJ', file, '(Organization)');
  }
}

// 2. NewsArticle + BreadcrumbList sur les articles
const ARTICLES = [
  { file: 'pages/actu/rapportCDG.html', headline: 'Rapport de la Cour des comptes : Les secours en montagne de février 2026', date: '2026-03-08', image: BASE + 'images/actu/prime-salaire-scaled.jpg', slug: 'pages/actu/rapportCDG.html' },
  { file: 'pages/actu/bonne-annee-2026.html', headline: 'Meilleurs vœux 2026', date: '2026-01-02', image: BASE + 'images/actu/bonne-annee-2026.jpg', slug: 'pages/actu/bonne-annee-2026.html' },
  { file: 'pages/actu/stop-agressions-sapeurs-pompiers.html', headline: "STOP face aux agressions à l'encontre des sapeurs-pompiers", date: '2025-04-08', image: BASE + 'images/actu/Sapeurs-pompiers.jpg', slug: 'pages/actu/stop-agressions-sapeurs-pompiers.html' },
];
for (const a of ARTICLES) {
  const url = BASE + a.slug;
  const article = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: a.headline,
    datePublished: a.date,
    image: [a.image],
    author: { '@type': 'Organization', name: 'Syndicat Autonome 06' },
    publisher: PUBLISHER,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };
  const crumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: BASE },
      { '@type': 'ListItem', position: 2, name: 'Actualités', item: BASE + 'pages/actu.html' },
      { '@type': 'ListItem', position: 3, name: a.headline, item: url },
    ],
  };
  injectBeforeHead(a.file, ld(article) + ld(crumbs));
}

// 3. FAQPage
{
  const file = 'pages/faq.html';
  const s = fs.readFileSync(file, 'utf8');
  const titles = [...s.matchAll(/accordion-title">([\s\S]*?)<\/span>/g)].map(m => m[1].replace(/\s+/g, ' ').trim());
  const answers = [...s.matchAll(/accordion-content-inner">\s*<p>([\s\S]*?)<\/p>/g)].map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim());
  if (titles.length && titles.length === answers.length) {
    const faq = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: titles.map((q, i) => ({
        '@type': 'Question',
        name: q,
        acceptedAnswer: { '@type': 'Answer', text: answers[i] },
      })),
    };
    injectBeforeHead(file, ld(faq));
  } else {
    console.log('FAQ: extraction incohérente (', titles.length, 'questions /', answers.length, 'réponses) -> non injecté');
  }
}
