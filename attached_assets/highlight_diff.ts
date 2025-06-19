// highlight_diff.ts
// Utility to highlight differences between two images in red using Jimp

import { Jimp } from 'jimp';

interface Box { x1: number; y1: number; x2: number; y2: number; }

function getBoundingBoxes(diffMask: boolean[][]): Box[] {
  // Simple connected-component bounding box extraction
  const height = diffMask.length;
  const width = diffMask[0].length;
  const visited = Array.from({ length: height }, () => Array(width).fill(false));
  const boxes: Box[] = [];

  function bfs(sx: number, sy: number) {
    let minX = sx, minY = sy, maxX = sx, maxY = sy;
    const queue = [[sx, sy]];
    visited[sy][sx] = true;
    while (queue.length) {
      const [x, y] = queue.shift()!;
      for (const [dx, dy] of [[0,1],[1,0],[0,-1],[-1,0]]) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height && diffMask[ny][nx] && !visited[ny][nx]) {
          visited[ny][nx] = true;
          queue.push([nx, ny]);
          minX = Math.min(minX, nx);
          minY = Math.min(minY, ny);
          maxX = Math.max(maxX, nx);
          maxY = Math.max(maxY, ny);
        }
      }
    }
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (diffMask[y][x] && !visited[y][x]) {
        boxes.push(bfs(x, y));
      }
    }
  }
  return boxes;
}

// Define 10 visual testing layers with unique colors and names
interface VisualLayer { name: string; color: [number, number, number, number]; }
const VISUAL_LAYERS: VisualLayer[] = [
  { name: 'layout', color: [255, 99, 71, 120] },        // Tomato
  { name: 'color', color: [30, 144, 255, 120] },       // DodgerBlue
  { name: 'font', color: [255, 215, 0, 120] },         // Gold
  { name: 'text', color: [50, 205, 50, 120] },         // LimeGreen
  { name: 'border', color: [138, 43, 226, 120] },      // BlueViolet
  { name: 'shadow', color: [255, 20, 147, 120] },      // DeepPink
  { name: 'icon', color: [0, 206, 209, 120] },         // DarkTurquoise
  { name: 'spacing', color: [255, 140, 0, 120] },      // DarkOrange
  { name: 'image', color: [70, 130, 180, 120] },       // SteelBlue
  { name: 'misc', color: [220, 20, 60, 120] }         // Crimson
];

// Simulate layer check results (replace with your real logic)
function getFailedLayersForBox(box: Box): VisualLayer[] {
  // For demo: randomly fail 1-2 layers per box
  const failed: VisualLayer[] = [];
  const count = 1 + Math.floor(Math.random() * 2);
  const shuffled = [...VISUAL_LAYERS].sort(() => 0.5 - Math.random());
  for (let i = 0; i < count; i++) failed.push(shuffled[i]);
  return failed;
}

export async function highlightDiff(
  baselinePath: string,
  currentPath: string,
  outputDir: string
) {
  const [img1, img2] = await Promise.all([
    Jimp.read(baselinePath),
    Jimp.read(currentPath)
  ]);

  let width = img1.bitmap.width;
  let height = img1.bitmap.height;

  // If dimensions differ, resize both to the smallest common size
  if (img1.bitmap.width !== img2.bitmap.width || img1.bitmap.height !== img2.bitmap.height) {
    width = Math.min(img1.bitmap.width, img2.bitmap.width);
    height = Math.min(img1.bitmap.height, img2.bitmap.height);
    img1.resize({ w: width, h: height });
    img2.resize({ w: width, h: height });
    console.warn('Images had different dimensions. Both resized to smallest common size for comparison.');
  }

  // Build diff mask
  const diffMask: boolean[][] = Array.from({ length: height }, () => Array(width).fill(false));
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const r1 = img1.bitmap.data[idx + 0];
      const g1 = img1.bitmap.data[idx + 1];
      const b1 = img1.bitmap.data[idx + 2];
      const r2 = img2.bitmap.data[idx + 0];
      const g2 = img2.bitmap.data[idx + 1];
      const b2 = img2.bitmap.data[idx + 2];
      if (r1 !== r2 || g1 !== g2 || b1 !== b2) {
        diffMask[y][x] = true;
      }
    }
  }

  // Get bounding boxes for diff regions
  const boxes = getBoundingBoxes(diffMask);

  // Create side-by-side image
  const outImg = await new Jimp({ width: width * 2, height });
  outImg.composite(img1, 0, 0);
  outImg.composite(img2, width, 0);

  // Helper to convert int to RGBA (since Jimp.intToRGBA may not exist)
  function intToRGBA(i: number) {
    return {
      r: (i >> 16) & 0xff,
      g: (i >> 8) & 0xff,
      b: i & 0xff,
      a: (i >> 24) & 0xff
    };
  }

  // Helper to get RGBA int (unsigned)
  function rgbaToInt(r: number, g: number, b: number, a: number) {
    return ((a << 24) | (r << 16) | (g << 8) | b) >>> 0;
  }
  const red = rgbaToInt(255,0,0,255);
  const green = rgbaToInt(0,255,0,255);

  // Premium highlight: rounded corners, soft glow, blend
  function blendColor(orig, highlight, alpha) {
    return Math.round(orig * (1 - alpha) + highlight * alpha);
  }
  const highlightAlpha = 0.4;

  for (const box of boxes) {
    const failedLayers = getFailedLayersForBox(box); // Replace with your real check
    for (const layer of failedLayers) {
      const [hr, hg, hb, ha] = layer.color;
      // Soft glow: expand box by 2px, rounded corners
      for (let y = box.y1 - 2; y <= box.y2 + 2; y++) {
        for (let x = box.x1 - 2; x <= box.x2 + 2; x++) {
          if (x < 0 || y < 0 || x >= width || y >= height) continue;
          // Rounded corners
          const inCorner = ((x === box.x1 - 2 || x === box.x2 + 2) && (y === box.y1 - 2 || y === box.y2 + 2));
          if (inCorner) continue;
          // Baseline (left)
          const origL = intToRGBA(outImg.getPixelColor(x, y));
          const blendedL = rgbaToInt(
            blendColor(origL.r, hr, highlightAlpha),
            blendColor(origL.g, hg, highlightAlpha),
            blendColor(origL.b, hb, highlightAlpha),
            255
          );
          outImg.setPixelColor(blendedL, x, y);
          // Current (right)
          const origR = intToRGBA(outImg.getPixelColor(x + width, y));
          const blendedR = rgbaToInt(
            blendColor(origR.r, hr, highlightAlpha),
            blendColor(origR.g, hg, highlightAlpha),
            blendColor(origR.b, hb, highlightAlpha),
            255
          );
          outImg.setPixelColor(blendedR, x + width, y);
        }
      }
    }
  }

  // Generate filename with date and time
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-');
  const outputPath = `${outputDir}/diff-${timestamp}.png` as `${string}.${string}`;

  await new Promise((resolve, reject) => {
    try {
      outImg.write(outputPath);
      resolve(null);
    } catch (err) {
      reject(err);
    }
  });
  console.log(`Diff image saved to ${outputPath}`);
}

// Example usage (uncomment to run directly)
// highlightDiff('baseline/flipkart.png', 'current/flipkart.png', 'diffimage');
