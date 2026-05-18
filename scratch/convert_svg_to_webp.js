const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const svgsToConvert = [
    'logo.svg',
    'banner-1.svg',
    'banner-2.svg',
    'banner-3.svg',
    'banner-4.svg',
    'card-printer-ribbon-accessories.svg',
    'magnetic-plastic-cards-high-quality.svg',
    'money-safe-security-cash-protection.svg',
    'plastic-card-printer-primacy-lava.svg'
];

async function convert() {
    console.log('Starting SVG to WebP conversion...');
    
    for (const file of svgsToConvert) {
        const inputPath = path.join(assetsDir, file);
        const baseName = path.basename(file, '.svg');
        const outputPath = path.join(assetsDir, `${baseName}.webp`);
        
        if (!fs.existsSync(inputPath)) {
            console.log(`Skipping: ${file} does not exist`);
            continue;
        }
        
        try {
            console.log(`Converting ${file}...`);
            const inputBuffer = fs.readFileSync(inputPath);
            
            // Render SVG to high-quality WebP
            // sharp automatically resolves embedded base64 data: urls
            await sharp(inputBuffer, { density: 300 }) // High density for crisp vector rendering
                .webp({ quality: 85 })
                .toFile(outputPath);
                
            const inputSize = fs.statSync(inputPath).size;
            const outputSize = fs.statSync(outputPath).size;
            const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);
            
            console.log(`Successfully converted ${file} to ${baseName}.webp:`);
            console.log(`  Original: ${(inputSize / 1024).toFixed(1)} KB`);
            console.log(`  Optimized WebP: ${(outputSize / 1024).toFixed(1)} KB`);
            console.log(`  Size Reduction: ${savings}%`);
        } catch (error) {
            console.error(`Error converting ${file}:`, error);
        }
    }
}

convert();
