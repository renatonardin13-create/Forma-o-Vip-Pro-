const fs = require('fs');
let content = fs.readFileSync('src/components/EbookReaderModal.tsx', 'utf8');

// 1. Remove condition on mode toggle
content = content.replace(
  /{signedUrl && product\.id !== 'prod-depois-dos-60-real' && \(/g,
  '{signedUrl && ('
);

// 2. Remove condition on MODO 1 render
content = content.replace(
  /\{\(viewMode === 'pdf' \|\| product\.id === 'prod-depois-dos-60-real'\) \? \(/g,
  '{viewMode === \'pdf\' ? ('
);

// 3. Remove conditional title
content = content.replace(
  /\{product\.id === 'prod-depois-dos-60-real' \? 'Leitor VIP Seguro' : 'E-book Seguro Conectado'\}/g,
  'E-book Seguro Conectado'
);

// 4. Remove condition on "Alternar para Leitor VIP"
content = content.replace(
  /\{product\.id !== 'prod-depois-dos-60-real' && \(\s*(<button[\s\S]*?<\/button>)\s*\)\}/g,
  '$1'
);

// 5. Remove fallback from MODO 1 PDF render
content = content.replace(
  /\{product\.id === 'prod-depois-dos-60-real' && !signedUrl \? \([\s\S]*?\) : \(\s*(<PdfViewer url=\{signedUrl \|\| ''\} \/>)\s*\)\}/g,
  '$1'
);

fs.writeFileSync('src/components/EbookReaderModal.tsx', content);
console.log('Cleaned up legacy block');
