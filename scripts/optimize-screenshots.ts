/**
 * Optimize raw PNG screenshots to WebP for the pubsite.
 *
 * Usage:
 *   npx tsx scripts/optimize-screenshots.ts
 *
 * Reads from docs/assets/screenshots/{desktop,mobile}/*.png
 * Outputs to docs/assets/screenshots/optimized/{desktop,mobile}/*.webp
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC_DIR = path.join(ROOT, 'docs/assets/screenshots');
const OUT_DIR = path.join(SRC_DIR, 'optimized');

const CONFIGS = {
  desktop: { maxWidth: 1440 },
  mobile: { maxWidth: 786 },
} as const;

async function optimizeFile(srcPath: string, outPath: string, maxWidth: number) {
  const srcSize = fs.statSync(srcPath).size;

  await sharp(srcPath)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(outPath);

  const outSize = fs.statSync(outPath).size;
  const saved = ((1 - outSize / srcSize) * 100).toFixed(1);
  const name = path.basename(srcPath);
  console.log(
    `  ${name} → ${(srcSize / 1024).toFixed(0)}KB → ${(outSize / 1024).toFixed(0)}KB (${saved}% smaller)`,
  );
}

async function main() {
  let totalSrc = 0;
  let totalOut = 0;
  let count = 0;

  for (const [folder, config] of Object.entries(CONFIGS)) {
    const srcFolder = path.join(SRC_DIR, folder);
    const outFolder = path.join(OUT_DIR, folder);
    fs.mkdirSync(outFolder, { recursive: true });

    const files = fs.readdirSync(srcFolder).filter((f) => f.endsWith('.png'));
    console.log(`\n${folder}/ (${files.length} files, max-width ${config.maxWidth}px):`);

    for (const file of files) {
      const srcPath = path.join(srcFolder, file);
      const outPath = path.join(outFolder, file.replace('.png', '.webp'));
      await optimizeFile(srcPath, outPath, config.maxWidth);

      totalSrc += fs.statSync(srcPath).size;
      totalOut += fs.statSync(outPath).size;
      count++;
    }
  }

  console.log(`\nDone: ${count} images optimized`);
  console.log(
    `Total: ${(totalSrc / 1024 / 1024).toFixed(2)}MB → ${(totalOut / 1024 / 1024).toFixed(2)}MB (${((1 - totalOut / totalSrc) * 100).toFixed(1)}% smaller)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
