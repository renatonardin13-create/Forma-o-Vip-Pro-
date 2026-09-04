import { render } from '@resvg/resvg-js';
import fs from 'fs';
import path from 'path';

const assetsDir = path.resolve('public/areas/ebooks');

const files = [
  {
    svg: 'logo.svg',
    png: 'logo.png',
    width: 800,
    height: 200
  },
  {
    svg: 'favicon.svg',
    png: 'favicon.png',
    width: 512,
    height: 512
  },
  {
    svg: 'banner.svg',
    png: 'banner.png',
    width: 1920,
    height: 600
  },
  {
    svg: 'capa.svg',
    png: 'capa.png',
    width: 1000,
    height: 1250
  }
];

async function renderAssets() {
  console.log('Rendering SVG assets to PNG...');
  for (const item of files) {
    const svgPath = path.join(assetsDir, item.svg);
    const pngPath = path.join(assetsDir, item.png);
    const svgContent = fs.readFileSync(svgPath, 'utf8');

    const resvg = new (await import('@resvg/resvg-js')).Resvg(svgContent, {
      fitTo: {
        mode: 'width',
        value: item.width
      }
    });

    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();
    fs.writeFileSync(pngPath, pngBuffer);
    console.log(`✅ Rendered ${item.png} (${item.width}x${item.height} px, ${pngBuffer.length} bytes)`);
  }
  console.log('All assets rendered successfully!');
}

renderAssets().catch(err => {
  console.error('Error rendering assets:', err);
  process.exit(1);
});
