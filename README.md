# SA06
Site web du Syndicat Autonome 06

## Technologies
- HTML
- CSS
- JavaScript
- PWA

## Build

Le site est édité en HTML/CSS/JS statique à la racine (`index.html`, `pages/`, `css/`, `js/`…).
Les en-têtes et pieds de page communs sont factorisés dans `partials/` et insérés via le
marqueur `<!-- @include header -->` / `<!-- @include footer -->` (chemins résolus par profondeur).

```bash
npm install      # une fois
npm run build    # génère dist/, le dossier à déployer sur sa06.org
```

Le build (`scripts/build.js`) :
- injecte les partials header/footer ;
- remplace le CDN Font Awesome par un sous-ensemble auto-hébergé (`scripts/fa-subset.js`) ;
- purge le CSS inutilisé (PurgeCSS) ;
- minifie CSS / JS / HTML (esbuild + html-minifier-terser).

> `dist/` est régénéré à chaque build et n'est pas versionné (voir `.gitignore`).
> Pour rejouer l'extraction des partials depuis `index.html` : `npm run extract-partials`.