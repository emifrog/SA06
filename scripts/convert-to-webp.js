const sharp = require('sharp');
const path = require('path');

const basePath = path.resolve(__dirname, '..');

const conversions = [
  { src: 'images/actu/finances-scaled.jpg', dest: 'images/actu/finances-scaled.webp' },
  { src: 'images/actu/Sapeurs-pompiers.jpg', dest: 'images/actu/Sapeurs-pompiers.webp' },
  { src: 'images/actu/réseaux sociaux.png', dest: 'images/actu/réseaux sociaux.webp' },
  { src: 'images/pompier.png', dest: 'images/pompier.webp' },
  { src: 'images/administratif.jpg', dest: 'images/administratif.webp' },
  { src: 'images/technique.jpg', dest: 'images/technique.webp' },
  { src: 'images/justice.jpg', dest: 'images/justice.webp' },
  { src: 'images/FA.jpg', dest: 'images/FA.webp' },
];

async function convert() {
  for (const { src, dest } of conversions) {
    const srcPath = path.join(basePath, src);
    const destPath = path.join(basePath, dest);
    try {
      await sharp(srcPath).webp({ quality: 80 }).toFile(destPath);
      console.log(`OK: ${src} -> ${dest}`);
    } catch (err) {
      console.error(`ERREUR: ${src} -> ${err.message}`);
    }
  }
}

convert();
