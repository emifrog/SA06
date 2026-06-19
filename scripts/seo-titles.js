// Attribue un <title>, une meta description et des og:title/og:description
// uniques à chaque page (corrige la duplication SEO). Idempotent.
const fs = require('fs');

const MAP = {
  'pages/actu.html': {
    t: `Actualités syndicales du SDIS 06 | SA06`,
    d: `Toute l'actualité du Syndicat Autonome 06 : informations, communiqués et mobilisations des sapeurs-pompiers et personnels du SDIS 06.`,
  },
  'pages/adherer.html': {
    t: `Adhérer au Syndicat Autonome 06 | SA06`,
    d: `Rejoignez le SA06, 1ère force syndicale du SDIS 06. Bulletins d'adhésion SPP et PATS à télécharger pour défendre vos droits.`,
  },
  'pages/contact.html': {
    t: `Contacter le Syndicat Autonome 06 | SA06`,
    d: `Une question, une situation à signaler ? Contactez le Syndicat Autonome 06, à l'écoute des sapeurs-pompiers et personnels du SDIS 06.`,
  },
  'pages/faq.html': {
    t: `FAQ — Questions fréquentes | SA06`,
    d: `Les réponses aux questions fréquentes sur le Syndicat Autonome 06, l'adhésion et la défense de vos droits au sein du SDIS 06.`,
  },
  'pages/media.html': {
    t: `Parole Autonome — Le SA06 dans les médias`,
    d: `Retrouvez le Syndicat Autonome 06 dans les médias : reportages, interviews et prises de parole sur la situation des sapeurs-pompiers du 06.`,
  },
  'pages/droits/conges.html': {
    t: `Les congés annuels des sapeurs-pompiers | SA06`,
    d: `Tout savoir sur les congés annuels des sapeurs-pompiers et personnels du SDIS 06 : règles, droits et démarches expliqués par le SA06.`,
  },
  'pages/droits/greve.html': {
    t: `Le droit de grève des sapeurs-pompiers | SA06`,
    d: `Le droit de grève des sapeurs-pompiers expliqué par le Syndicat Autonome 06 : cadre légal, modalités et garanties au SDIS 06.`,
  },
  'pages/sinformer/rifseep.html': {
    t: `Le RIFSEEP expliqué aux agents | SA06`,
    d: `Comprendre le RIFSEEP : régime indemnitaire, IFSE et CIA des personnels du SDIS 06, décryptés par le Syndicat Autonome 06.`,
  },
  'pages/videos/videos.html': {
    t: `90% des pompiers du 06 en grève | SA06`,
    d: `Vidéo : dans les Alpes-Maritimes, 90% des sapeurs-pompiers en grève depuis le 8 février. Reportage et analyse du Syndicat Autonome 06.`,
  },
  'pages/videos/consommables.html': {
    t: `Consommables : de la passion au poison | SA06`,
    d: `Vidéo « Consommables — De la passion au poison » : le SA06 alerte sur l'exposition des sapeurs-pompiers aux substances toxiques.`,
  },
  'pages/actu/rapportCDG.html': {
    t: `Cour des comptes : les secours en montagne | SA06`,
    d: `Le Syndicat Autonome 06 décrypte le rapport de la Cour des comptes de février 2026 sur l'organisation des secours en montagne.`,
  },
  'pages/actu/bonne-annee-2026.html': {
    t: `Meilleurs vœux 2026 | SA06`,
    d: `Le Syndicat Autonome 06 vous présente ses meilleurs vœux pour 2026 et réaffirme son engagement aux côtés des sapeurs-pompiers du SDIS 06.`,
  },
  'pages/actu/STOP face aux agressions à l’encontre des sapeurs-pompiers.html': {
    t: `STOP aux agressions contre les pompiers | SA06`,
    d: `Le Syndicat Autonome 06 dit STOP aux agressions à l'encontre des sapeurs-pompiers et exige des mesures de protection au SDIS 06.`,
  },
};

let changed = 0;
for (const [file, { t, d }] of Object.entries(MAP)) {
  if (!fs.existsSync(file)) { console.log('INTROUVABLE', file); continue; }
  let s = fs.readFileSync(file, 'utf8');
  const before = s;
  s = s.replace(/<title>[\s\S]*?<\/title>/i, `<title>${t}</title>`);
  s = s.replace(/(<meta name="description"\s+content=")[\s\S]*?("\s*>)/i, `$1${d}$2`);
  s = s.replace(/(<meta property="og:title" content=")[^"]*(">)/i, `$1${t}$2`);
  s = s.replace(/(<meta property="og:description"\s+content=")[\s\S]*?("\s*>)/i, `$1${d}$2`);
  if (s !== before) { fs.writeFileSync(file, s); changed++; console.log('MAJ', file); }
  else console.log('INCHANGE', file);
}
console.log('Total modifié:', changed);
