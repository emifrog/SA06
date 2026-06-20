# Plan d'action — Audit du site SA06

> Site statique PWA du Syndicat Autonome 06 (sapeurs-pompiers, SDIS 06) — `sa06.org`
> Audit réalisé le 19/06/2026. Dimensions couvertes : Performance, SEO, Accessibilité, Sécurité, PWA, Qualité de code.

## Sommaire des notes

| Dimension | Note | Priorité globale |
|---|---|---|
| Performance | 3/10 | 🔴 Critique |
| SEO | 4/10 | 🔴 Critique |
| Accessibilité | 4/10 | 🟠 Élevée |
| Sécurité | 5/10 | 🟠 Élevée |
| PWA / Qualité | 5/10 | 🟠 Élevée |

**Légende effort :** 🟢 < 1 h · 🟡 quelques heures · 🔴 > 1 jour
**Légende impact :** ⭐ faible · ⭐⭐ moyen · ⭐⭐⭐ fort

---

## Phase 1 — Quick wins (à faire en premier)

> Gain estimé : ~9 Mo de poids en moins par page + correction des bases SEO. Effort total ≈ 1 journée.

- [x] **1.1 — Compresser le SVG de 4,6 Mo** ⭐⭐⭐ 🟢
  - Fichier : `images/actu/bonne-annee-2026.svg` (4 692 Ko), utilisé dans `index.html:518`
  - Action : remplacer par un WebP/JPG rasterisé en 347×201 (et 694×402 pour le 2×). Cible **< 40 Ko**.
  - Gain : ~99 % sur cette image (~4,6 Mo).

- [x] **1.2 — Recompresser / convertir les grosses images** ⭐⭐⭐ 🟡
  - `images/actu/Sapeurs-pompiers.jpg` (1,3 Mo → le `.webp` 120 Ko existe déjà, vérifier l'usage)
  - `images/bandeau2.png` (1 Mo), `images/media/parole-autonome.png` (1,3 Mo)
  - `images/media/consommables.png` (1 Mo), `images/actu/réseaux sociaux.png` (600 Ko)
  - `images/actu/prime-salaire-scaled.jpg` (308 Ko pour 96×96 px — fichier corrompu/EXIF)
  - Action : redimensionner aux dimensions d'affichage + WebP (mozjpeg q80 / pngquant). `sharp` est déjà installé.
  - Gain cumulé : ~4-5 Mo.

- [x] **1.3 — Corriger le bug `<picture>`** ⭐⭐ 🟢
  - `index.html:489-492` : la `<source>` webp pointe `réseaux sociaux.webp` mais l'`<img>` charge `prime-salaire-scaled.jpg` (deux images différentes).
  - Action : réaligner source et fallback sur la même image.

- [x] **1.4 — Créer `robots.txt` et `sitemap.xml`** ⭐⭐⭐ 🟢
  - Absents aujourd'hui.
  - `robots.txt` avec `Sitemap: https://sa06.org/sitemap.xml`
  - `sitemap.xml` listant les URLs canoniques des 19 pages.

- [x] **1.5 — Désactiver le soft-404** ⭐⭐⭐ 🟢
  - `.htaccess:67-70` (RewriteRule vers index.html) + `.htaccess:74` (`ErrorDocument 404 /index.html`)
  - Action : créer une vraie page `404.html`, `ErrorDocument 404 /404.html`, supprimer la `RewriteRule . /index.html` (inadaptée à un site multi-pages).

- [x] **1.6 — Titres et meta-descriptions uniques par page** ⭐⭐⭐ 🟡
  - 14 pages partagent le même `<title>` et la même `<meta description>` (`index.html:31,33` + 13 pages, ligne 11/13).
  - Action : un title (50-60 car.) et une description (120-160 car.) propres à chaque page.
  - Corriger au passage la faute « 1er force » → « 1ère force » (`adherer.html`, `contact.html`, `videos/*.html`).

- [x] **1.7 — Nettoyage du dépôt git** ⭐⭐ 🟢
  - Créer `.gitignore` (`node_modules/`, `tmpclaude-*`, `*.log`).
  - `git rm -r --cached node_modules` (110 fichiers, ~20 Mo de DLL Windows versionnés).
  - Supprimer les 5 fichiers parasites `tmpclaude-*-cwd` (racine + `pages/actu/`).
  - Supprimer les 4 PDF dupliqués dans `fonts/` (doublons de `data/`).

- [x] **1.8 — Optimiser le chemin critique** ⭐⭐ 🟡
  - Ajouter `preconnect` : `cdnjs.cloudflare.com`, `cdn.onesignal.com`, `fonts.gstatic.com`.
  - Ajouter `preload` des 2 fonts woff2 critiques (400 + 700).
  - Ajouter `defer` aux 6 scripts locaux (`index.html:1144-1149`).
  - Supprimer le `preload` redondant de `style.css` (`index.html:44`).

- [x] **1.9 — Ajouter `width`/`height` sur toutes les `<img>`** ⭐⭐ 🟡
  - Aucun `<img>` direct n'a de dimensions → CLS (Core Web Vitals).
  - Action : dimensions explicites ou `aspect-ratio` CSS.

---

## Phase 2 — Court terme (1 à 2 semaines)

### SEO

- [x] **2.1 — Ajouter les balises `canonical`** ⭐⭐⭐ 🟡 — aucune page n'en a aujourd'hui.
- [x] **2.2 — Réparer le partage social** ⭐⭐ 🟡
  - Ajouter `og:image` (1200×630) sur toutes les pages.
  - `og:type` : `website` (et `article` pour `pages/actu/*`) au lieu de `site web` (invalide).
  - `og:url` : URL absolue réelle au lieu de `#` sur les pages internes.
  - Ajouter les Twitter Cards (`twitter:card=summary_large_image`).
- [x] **2.3 — Données structurées JSON-LD** ⭐⭐ 🟡
  - `Organization`/`NGO` sur l'accueil (logo, sameAs réseaux sociaux déjà présents).
  - `NewsArticle` sur `pages/actu/*` (dates `<time>`, images, fils d'Ariane déjà présents).
  - `BreadcrumbList`, `FAQPage`, `VideoObject` selon les pages.
  - Ajouter `datetime` aux balises `<time>` (`pages/actu/*:667`, `videos/*:496`).
- [x] **2.4 — Corriger les liens internes cassés** ⭐⭐⭐ 🟡
  - Chemins `./pages/...` depuis une page déjà dans `/pages/` → `/pages/pages/...` (`faq.html:103,110`, `media.html:102,108`, `actu/*:90`).
  - `../adherer.html` depuis `/pages/` → `/adherer.html` inexistant (`faq.html:637`, `droits/*`).
  - Lien « Adhérer » vers `#` (`merci.html:141`).
- [x] **2.5 — Renommer le fichier à espaces/apostrophe** ⭐ 🟢
  - `pages/actu/STOP face aux agressions à l'encontre des sapeurs-pompiers.html` → `stop-agressions-sapeurs-pompiers.html` (+ MAJ du lien `actu.html:566`).
- [x] **2.6 — Corriger la hiérarchie des titres** ⭐ 🟡 — sauts h1→h3 (`droits/conges.html`, `actu/rapportCDG.html`).

### Accessibilité

- [x] **2.7 — Lien d'évitement « Aller au contenu »** ⭐⭐⭐ 🟢
  - Le CSS existe (`style.css:1090`) et `<main id="contenu-principal" tabindex="-1">` est prêt — le `<a>` manque dans le HTML.
- [x] **2.8 — Rendre la carte de France accessible au clavier** ⭐⭐⭐ 🟡
  - `js/france-map.js:67-81` : ajouter `tabindex="0"`, `role="button"`, `aria-label`, gestion `keydown` (Enter/Espace). Ne pas signaler la sélection par la seule couleur.
- [x] **2.9 — Fiabiliser le menu mobile** ⭐⭐ 🟡
  - `js/mobile-menu.js` : fermeture par Échap, confinement du focus (focus trap), restitution du focus au bouton burger.
- [x] **2.10 — Vidéos YouTube accessibles** ⭐⭐ 🟡
  - `js/youtube-player.js:167-178` : ajouter `title` à l'iframe, rendre le déclencheur focusable (`<button>`).
- [x] **2.11 — Modale de zoom (organigramme)** ⭐⭐ 🟢
  - `pages/asa/asa.html:121,126` : image cliquable → `<button>`, bouton de fermeture → `<button aria-label="Fermer">`.
- [x] **2.12 — Corriger les contrastes insuffisants** ⭐⭐ 🟡
  - `css/rifseep.css:320-325,521-523`, texte blanc sur rouge `#ed1b24`, `css/france-map.css:433`. Viser ≥ 4.5:1.
- [x] **2.13 — `prefers-reduced-motion` global** ⭐ 🟡
  - Étendre aux autres CSS (`css/mobile-menu.css:25`) et au slider auto (`main.js:352`) + bouton pause.
- [x] **2.14 — `alt` pertinents** ⭐ 🟡
  - Icônes de boutons redondantes → `alt=""` ; logos footer `alt="logo"` → descriptif ; corriger `alt="finance"` (`index.html:491`).

### Sécurité

- [x] **2.15 — Forcer HTTPS + HSTS** ⭐⭐⭐ 🟢
  - Décommenter le RewriteRule HTTPS (`.htaccess:62-64`).
  - Ajouter `Strict-Transport-Security` (après vérification HTTPS) et `Permissions-Policy`.
- [x] **2.16 — Corriger la validation du formulaire** ⭐⭐⭐ 🟢
  - `main.js:415,425` ciblent `formsubmit.co` mais le form utilise `formspree.io` (`contact.html:498`) → validation jamais exécutée. Corriger le sélecteur.
- [x] **2.17 — Corriger l'ID dupliqué du formulaire** ⭐⭐ 🟢
  - `contact.html:517-535` : « Prénom » et « Affectation » partagent `id="contact_firstName"`/`name="firstName"` → perte de données. Renommer en `contact_affectation`/`name="affectation"`.
- [x] **2.18 — Page « politique de confidentialité »** ⭐⭐ 🟡
  - `contact.html:583` pointe vers `/legal/privacy-policy` inexistant (enjeu RGPD). Créer la page.
- [x] **2.19 — `rel="noopener noreferrer"` sur les `target="_blank"` externes** ⭐ 🟢
  - Manquants : `actu/*:689,696,703`, `adherer.html:500-521`, `videos/*:520-534`.
- [x] **2.20 — Réparer ou retirer la recherche** ⭐⭐ 🟡
  - `pages/search.html` fait 0 octet alors que ~14 pages pointent dessus.

### PWA

- [x] **2.21 — Supprimer le service worker mort** ⭐ 🟢 — `OneSignalSDKWorker.js` n'est référencé nulle part.
- [x] **2.22 — Compléter le manifest** ⭐ 🟡
  - Ajouter `screenshots` (wide + narrow), harmoniser `start_url: "/"` avec `scope`/`id`, vraies icônes maskable avec safe-zone.
- [x] **2.23 — Compléter le précache SW** ⭐ 🟢
  - Ajouter `js/pwa.js`, `js/youtube-player.js`, `logo-192x192.png`, `logo-512x512.png` à `STATIC_CACHE_URLS`.
  - Corriger le fallback offline (`sw.js:125-127`) : `offline.html` n'est jamais atteint.

---

## Phase 3 — Moyen terme (chantiers de fond)

- [ ] **3.1 — Factoriser header / menu / footer** ⭐⭐⭐ 🔴
  - ~390 lignes de header + ~95 de footer copiées-collées dans 14 pages.
  - Action : passer à un générateur statique (Eleventy/11ty) ou des includes SSI Apache.
- [ ] **3.2 — Minifier CSS/JS au build** ⭐⭐ 🟡
  - `style.css` 148 Ko (1 284 lignes vides) → ~90 Ko. Mettre en place un pipeline (cssnano/csso, esbuild).
- [ ] **3.3 — Alléger Font Awesome** ⭐⭐ 🟡
  - `all.min.css` complet (~150 Ko) pour ~24 icônes utilisées → sous-ensemble SVG. Gain ~140-180 Ko.
- [ ] **3.4 — Purger le CSS inutilisé** ⭐⭐ 🟡 — PurgeCSS (vestiges de thème), gain potentiel 30-50 %.
- [ ] **3.5 — Durcir la CSP** ⭐⭐ 🔴
  - Retirer `'unsafe-inline'` de `script-src` (externaliser le script OneSignal inline), ajouter SRI sur Font Awesome, `frame-ancestors 'none'`, restreindre `img-src`.
- [ ] **3.6 — Ajouter Brotli + compresser le SVG** ⭐⭐ 🟢
  - Bloc `mod_brotli` dans `.htaccess` + inclure `image/svg+xml` dans DEFLATE.
- [ ] **3.7 — Harmoniser la marque et les domaines** ⭐⭐ 🟡
  - Unifier SA06 / ASA06 / ASA 06 ; un seul domaine de référence (`sa06.org`) dans les liens de partage (`saspp06.fr` utilisé dans les mailto).
  - Purger les vestiges du template CFDT (liens morts `cfdt.fr`, `qui-est-la-cfdt`, `index.html:705,728,751`).
- [ ] **3.8 — Retirer les `console.log` de production** ⭐ 🟢 — `main.js`, `js/pwa.js`, `js/france-map.js`, `sw.js:49`.
- [ ] **3.9 — Stratégie de cache images du SW** ⭐ 🟡 — plafonner/purger le cache runtime (sinon gonflement illimité).

---

## Suivi

| Phase | Items | Effort estimé | Statut |
|---|---|---|---|
| Phase 1 — Quick wins | 9 | ~1 jour | ✅ Fait (19/06/2026) |
| Phase 2 — Court terme | 23 | ~1-2 semaines | ✅ Fait (20/06/2026) |
| Phase 3 — Moyen terme | 9 | chantiers de fond | ⬜ À faire |

> Recommandation : enchaîner Phase 1 d'un bloc (fort impact, faible risque), puis traiter la Phase 2 par lots thématiques (SEO, puis A11y, puis Sécurité/PWA).
