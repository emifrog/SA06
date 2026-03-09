const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const splashSizes = [
    { name: 'splash-1170x2532.png', width: 1170, height: 2532 },
    { name: 'splash-1125x2436.png', width: 1125, height: 2436 },
    { name: 'splash-1242x2688.png', width: 1242, height: 2688 },
    { name: 'splash-828x1792.png',  width: 828,  height: 1792 },
    { name: 'splash-1179x2556.png', width: 1179, height: 2556 },
    { name: 'splash-1290x2796.png', width: 1290, height: 2796 },
];

const outputDir = path.join(__dirname, '..', 'images', 'splash');
const logoPath = path.join(__dirname, '..', 'images', 'logo-512x512.png');

async function generateSplash(size) {
    const { width, height, name } = size;

    // Logo size: 30% of the smallest dimension
    const logoSize = Math.round(Math.min(width, height) * 0.3);

    // Resize logo
    const logo = await sharp(logoPath)
        .resize(logoSize, logoSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .png()
        .toBuffer();

    // Create gradient background using SVG
    const svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#3262ac"/>
                <stop offset="100%" style="stop-color:#1e3a6e"/>
            </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#bg)"/>
        <text x="${width / 2}" y="${Math.round(height / 2 + logoSize / 2 + 80)}"
              font-family="sans-serif" font-weight="bold" font-size="${Math.floor(width * 0.08)}"
              fill="white" text-anchor="middle">SA06</text>
        <text x="${width / 2}" y="${Math.round(height / 2 + logoSize / 2 + 130)}"
              font-family="sans-serif" font-size="${Math.floor(width * 0.035)}"
              fill="rgba(255,255,255,0.8)" text-anchor="middle">Syndicat Autonome 06</text>
    </svg>`;

    const background = await sharp(Buffer.from(svg))
        .png()
        .toBuffer();

    // Composite logo on background
    const logoX = Math.round((width - logoSize) / 2);
    const logoY = Math.round((height - logoSize) / 2 - 50);

    await sharp(background)
        .composite([{ input: logo, left: logoX, top: logoY }])
        .png()
        .toFile(path.join(outputDir, name));

    console.log(`  ${name} (${width}x${height})`);
}

async function main() {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log('Generation des splash screens iOS...\n');

    for (const size of splashSizes) {
        await generateSplash(size);
    }

    console.log('\nTermine ! Les images sont dans images/splash/');
}

main().catch(console.error);
