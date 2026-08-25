/**
 * Client-Side Image Optimizer and Compressor
 * Converts raw uploaded files into lightweight, high-quality Data URLs
 * to ensure fast rendering and prevent browser LocalStorage quota limits.
 */

export interface OptimizedImageResult {
  dataUrl: string;
  originalSize: number;
  optimizedSize: number;
  dimensions: { width: number; height: number };
  format: string;
}

/**
 * Optimizes image file using off-screen HTML5 Canvas
 */
export async function optimizeImageFile(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    forceSquare?: boolean;
    mimeType?: 'image/png' | 'image/jpeg' | 'image/webp';
  } = {}
): Promise<OptimizedImageResult> {
  const {
    maxWidth = 600,
    maxHeight = 200,
    quality = 0.88,
    forceSquare = false,
    mimeType = file.type === 'image/png' || file.type === 'image/svg+xml' ? 'image/png' : 'image/jpeg'
  } = options;

  // If SVG, check if size is already small (< 50KB). If so, load directly
  if (file.type === 'image/svg+xml' && file.size < 50 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        resolve({
          dataUrl,
          originalSize: file.size,
          optimizedSize: dataUrl.length,
          dimensions: { width: maxWidth, height: maxHeight },
          format: 'svg'
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Falha ao ler o arquivo de imagem.'));
    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Formato de imagem inválido ou corrompido.'));
      img.onload = () => {
        try {
          let { width, height } = img;

          // Calculate new dimensions preserving aspect ratio
          if (forceSquare) {
            const size = Math.min(maxWidth, maxHeight);
            width = size;
            height = size;
          } else {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          // Off-screen canvas
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, width);
          canvas.height = Math.max(1, height);

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Não foi possível inicializar o canvas 2D.');
          }

          // Smooth rendering settings
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // If square output (e.g. favicon) and source is rectangular, center-crop
          if (forceSquare && img.width !== img.height) {
            const minDim = Math.min(img.width, img.height);
            const sx = (img.width - minDim) / 2;
            const sy = (img.height - minDim) / 2;
            ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, width, height);
          } else {
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Convert to dataUrl
          const dataUrl = canvas.toDataURL(mimeType, quality);

          resolve({
            dataUrl,
            originalSize: file.size,
            optimizedSize: Math.round(dataUrl.length * 0.75), // approximate byte size
            dimensions: { width, height },
            format: mimeType.replace('image/', '')
          });
        } catch (err) {
          reject(err);
        }
      };

      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Formats bytes to human-readable string (e.g. 24.5 KB)
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
