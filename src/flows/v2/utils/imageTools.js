import { CONFIG } from '../config';

/**
 * Resizes an image file to a maximum dimension and returns a JPEG dataUrl and dimensions.
 */
export async function processImageFile(file, maxEdge = CONFIG.MAX_IMAGE_EDGE_PX, quality = CONFIG.IMAGE_QUALITY) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to decode image'));
      img.onload = () => {
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (width > maxEdge || height > maxEdge) {
          if (width > height) {
            height = Math.round((height * maxEdge) / width);
            width = maxEdge;
          } else {
            width = Math.round((width * maxEdge) / height);
            height = maxEdge;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          dataUrl,
          w: width,
          h: height,
          name: file.name,
          sizeBytes: Math.round(dataUrl.length * 0.75),
        });
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Generates an offline sample image using HTML5 Canvas (warm cream aesthetic).
 */
export function generateSampleImage(title = 'शर्मा स्वीट्स', subtitle = 'स्वादिष्ट ताज़ा मिष्ठान', width = 640, height = 360) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#FFF9EE');
  grad.addColorStop(1, '#FDE68A');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative pattern
  ctx.strokeStyle = 'rgba(227, 144, 38, 0.2)';
  ctx.lineWidth = 2;
  for (let i = -width; i < width * 2; i += 40) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i + height, height);
    ctx.stroke();
  }

  // Soft badge circle in center
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 20, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#E39026';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Shop icon / text
  ctx.fillStyle = '#2B2437';
  ctx.font = 'bold 36px "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(title.slice(0, 2), width / 2, height / 2 - 20);

  // Bottom Banner
  ctx.fillStyle = '#2B2437';
  ctx.fillRect(0, height - 70, width, 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(title, width / 2, height - 42);

  ctx.fillStyle = '#FDE68A';
  ctx.font = '14px "Noto Sans Devanagari", sans-serif';
  ctx.fillText(subtitle, width / 2, height - 18);

  const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
  return {
    id: `sample-${Date.now()}`,
    dataUrl,
    w: width,
    h: height,
    name: `${title}.jpg`,
  };
}
