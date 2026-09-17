const sharp = require('sharp');
const fs = require('fs');

async function resizeIcon() {
  console.log('Resizing icon...');
  await sharp('build/icon.png')
    .resize(512, 512, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 0 } // Transparent background
    })
    .toFile('build/icon-512.png');
    
  console.log('Replacing old icon...');
  fs.copyFileSync('build/icon-512.png', 'build/icon.png');
  fs.unlinkSync('build/icon-512.png');
  console.log('Done!');
}

resizeIcon().catch(console.error);
