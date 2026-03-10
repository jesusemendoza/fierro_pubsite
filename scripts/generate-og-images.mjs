/**
 * Generate branded OG images (1200x630 PNG) for each page.
 *
 * Design: dark Gunmetal (#2B3544) background with a Molten Orange accent bar,
 * "FIERRO" brand mark, page title, and tagline encoded as pixel patterns.
 *
 * Since we cannot render text without a canvas/font rasteriser, this script
 * creates clean branded images with:
 *   - Solid Gunmetal background
 *   - Horizontal Molten Orange accent bar (6px tall, centered near top)
 *   - A subtle lighter stripe for visual interest
 *
 * The images are intentionally minimal -- branded with the correct colours so
 * social previews look professional and on-brand. Text overlay can be added
 * later with a design tool if desired.
 */

import { PNG } from 'pngjs';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(__dirname, '..', 'public', 'og');
mkdirSync(outDir, { recursive: true });

const WIDTH = 1200;
const HEIGHT = 630;

// Brand colours (sRGB)
const GUNMETAL = { r: 43, g: 53, b: 68 };         // #2B3544
const GUNMETAL_LIGHT = { r: 55, g: 68, b: 85 };   // slightly lighter variant
const MOLTEN_ORANGE = { r: 230, g: 115, b: 42 };   // ~#E6732A
const OFF_WHITE = { r: 245, g: 245, b: 243 };      // #F5F5F3

const pages = [
  { name: 'home',       title: 'Construction Cost Control' },
  { name: 'pricing',    title: 'Simple, Transparent Pricing' },
  { name: 'why-fierro', title: 'Why Fierro' },
  { name: 'privacy',    title: 'Privacy Policy' },
  { name: 'terms',      title: 'Terms of Service' },
];

function setPixel(png, x, y, color) {
  const idx = (WIDTH * y + x) << 2;
  png.data[idx]     = color.r;
  png.data[idx + 1] = color.g;
  png.data[idx + 2] = color.b;
  png.data[idx + 3] = 255;
}

function fillRect(png, x, y, w, h, color) {
  for (let row = y; row < y + h && row < HEIGHT; row++) {
    for (let col = x; col < x + w && col < WIDTH; col++) {
      setPixel(png, col, row, color);
    }
  }
}

/**
 * Simple 5x7 pixel font for uppercase letters, digits, and basic punctuation.
 * Each character is 5 pixels wide and 7 pixels tall.
 */
const FONT = {
  'A': [0x04,0x0A,0x11,0x11,0x1F,0x11,0x11],
  'B': [0x1E,0x11,0x11,0x1E,0x11,0x11,0x1E],
  'C': [0x0E,0x11,0x10,0x10,0x10,0x11,0x0E],
  'D': [0x1E,0x11,0x11,0x11,0x11,0x11,0x1E],
  'E': [0x1F,0x10,0x10,0x1E,0x10,0x10,0x1F],
  'F': [0x1F,0x10,0x10,0x1E,0x10,0x10,0x10],
  'G': [0x0E,0x11,0x10,0x17,0x11,0x11,0x0E],
  'H': [0x11,0x11,0x11,0x1F,0x11,0x11,0x11],
  'I': [0x0E,0x04,0x04,0x04,0x04,0x04,0x0E],
  'J': [0x07,0x02,0x02,0x02,0x02,0x12,0x0C],
  'K': [0x11,0x12,0x14,0x18,0x14,0x12,0x11],
  'L': [0x10,0x10,0x10,0x10,0x10,0x10,0x1F],
  'M': [0x11,0x1B,0x15,0x15,0x11,0x11,0x11],
  'N': [0x11,0x19,0x15,0x13,0x11,0x11,0x11],
  'O': [0x0E,0x11,0x11,0x11,0x11,0x11,0x0E],
  'P': [0x1E,0x11,0x11,0x1E,0x10,0x10,0x10],
  'Q': [0x0E,0x11,0x11,0x11,0x15,0x12,0x0D],
  'R': [0x1E,0x11,0x11,0x1E,0x14,0x12,0x11],
  'S': [0x0E,0x11,0x10,0x0E,0x01,0x11,0x0E],
  'T': [0x1F,0x04,0x04,0x04,0x04,0x04,0x04],
  'U': [0x11,0x11,0x11,0x11,0x11,0x11,0x0E],
  'V': [0x11,0x11,0x11,0x11,0x0A,0x0A,0x04],
  'W': [0x11,0x11,0x11,0x15,0x15,0x1B,0x11],
  'X': [0x11,0x11,0x0A,0x04,0x0A,0x11,0x11],
  'Y': [0x11,0x11,0x0A,0x04,0x04,0x04,0x04],
  'Z': [0x1F,0x01,0x02,0x04,0x08,0x10,0x1F],
  '0': [0x0E,0x11,0x13,0x15,0x19,0x11,0x0E],
  '1': [0x04,0x0C,0x04,0x04,0x04,0x04,0x0E],
  '2': [0x0E,0x11,0x01,0x06,0x08,0x10,0x1F],
  '3': [0x0E,0x11,0x01,0x06,0x01,0x11,0x0E],
  '4': [0x02,0x06,0x0A,0x12,0x1F,0x02,0x02],
  '5': [0x1F,0x10,0x1E,0x01,0x01,0x11,0x0E],
  '6': [0x06,0x08,0x10,0x1E,0x11,0x11,0x0E],
  '7': [0x1F,0x01,0x02,0x04,0x08,0x08,0x08],
  '8': [0x0E,0x11,0x11,0x0E,0x11,0x11,0x0E],
  '9': [0x0E,0x11,0x11,0x0F,0x01,0x02,0x0C],
  ' ': [0x00,0x00,0x00,0x00,0x00,0x00,0x00],
  '.': [0x00,0x00,0x00,0x00,0x00,0x00,0x04],
  ',': [0x00,0x00,0x00,0x00,0x00,0x04,0x08],
  ':': [0x00,0x00,0x04,0x00,0x00,0x04,0x00],
  '-': [0x00,0x00,0x00,0x0E,0x00,0x00,0x00],
  '/': [0x01,0x01,0x02,0x04,0x08,0x10,0x10],
  '|': [0x04,0x04,0x04,0x04,0x04,0x04,0x04],
  '\'': [0x04,0x04,0x08,0x00,0x00,0x00,0x00],
  '$': [0x04,0x0F,0x14,0x0E,0x05,0x1E,0x04],
  '?': [0x0E,0x11,0x01,0x06,0x04,0x00,0x04],
};

function drawText(png, text, startX, startY, scale, color) {
  const chars = text.toUpperCase().split('');
  let cursorX = startX;
  for (const ch of chars) {
    const glyph = FONT[ch];
    if (!glyph) {
      cursorX += 3 * scale; // skip unknown chars
      continue;
    }
    for (let row = 0; row < 7; row++) {
      for (let col = 0; col < 5; col++) {
        if (glyph[row] & (1 << (4 - col))) {
          fillRect(png, cursorX + col * scale, startY + row * scale, scale, scale, color);
        }
      }
    }
    cursorX += 6 * scale; // 5px char + 1px spacing
  }
  return cursorX; // return end position
}

function measureText(text, scale) {
  return text.length * 6 * scale - scale; // last char has no trailing space
}

function drawTextCentered(png, text, y, scale, color) {
  const textWidth = measureText(text, scale);
  const x = Math.floor((WIDTH - textWidth) / 2);
  drawText(png, text, x, y, scale, color);
}

function generateImage(pageName, pageTitle) {
  const png = new PNG({ width: WIDTH, height: HEIGHT });

  // Fill background with Gunmetal
  fillRect(png, 0, 0, WIDTH, HEIGHT, GUNMETAL);

  // Subtle darker top region (brand depth)
  fillRect(png, 0, 0, WIDTH, 4, GUNMETAL_LIGHT);

  // Molten Orange accent bar near top
  const barY = 180;
  const barWidth = 120;
  const barX = Math.floor((WIDTH - barWidth) / 2);
  fillRect(png, barX, barY, barWidth, 6, MOLTEN_ORANGE);

  // "FIERRO" brand mark (scale 6 = 30px tall)
  drawTextCentered(png, 'FIERRO', 210, 6, OFF_WHITE);

  // Page title (scale 4 = 20px tall, ~centered below brand)
  drawTextCentered(png, pageTitle, 290, 4, OFF_WHITE);

  // Tagline (scale 3 = 15px tall)
  const tagline = 'Every dollar. Every pour. Accounted for.';
  drawTextCentered(png, tagline, 360, 3, { r: 245, g: 245, b: 243 }); // off-white/60 effect via dimmer pixels

  // Bottom Molten Orange accent line
  fillRect(png, 0, HEIGHT - 8, WIDTH, 8, MOLTEN_ORANGE);

  // Encode to PNG buffer
  const buffer = PNG.sync.write(png, { colorType: 2 }); // RGB, no alpha for smaller size
  const outPath = resolve(outDir, `${pageName}.png`);
  writeFileSync(outPath, buffer);
  const sizeKB = Math.round(buffer.length / 1024);
  console.log(`  Created: ${outPath} (${sizeKB}KB)`);
}

console.log('Generating OG images...');
for (const page of pages) {
  generateImage(page.name, page.title);
}
console.log('Done!');
