const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, '..', 'src', 'assets');
const files = fs.readdirSync(assetsDir);

console.log('Scanning assets in:', assetsDir);

files.forEach(file => {
    if (path.extname(file).toLowerCase() === '.svg') {
        const filePath = path.join(assetsDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Find embedded base64 PNGs
        // Usually matches xlink:href="data:image/png;base64,..." or href="data:image/png;base64,..."
        const regex = /(?:href|xlink:href)="data:image\/png;base64,([^"]+)"/g;
        let match;
        let count = 0;
        
        while ((match = regex.exec(content)) !== null) {
            count++;
            const base64Data = match[1];
            const buffer = Buffer.from(base64Data, 'base64');
            
            // Generate output path (e.g. logo.png or logo-1.png if multiple)
            const baseName = path.basename(file, '.svg');
            const suffix = count > 1 ? `-${count}` : '';
            const outFileName = `${baseName}${suffix}.png`;
            const outFilePath = path.join(assetsDir, outFileName);
            
            fs.writeFileSync(outFilePath, buffer);
            console.log(`Successfully extracted ${outFileName} (${(buffer.length / 1024).toFixed(1)} KB) from ${file}`);
        }
        
        if (count === 0) {
            console.log(`No embedded base64 PNG found in ${file}`);
        }
    }
});
