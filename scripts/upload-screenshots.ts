/**
 * Upload optimized WebP screenshots to Supabase public-assets bucket.
 *
 * Usage:
 *   SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/upload-screenshots.ts
 *
 * Reads from docs/assets/screenshots/optimized/{desktop,mobile}/*.webp
 * Uploads to public-assets bucket at pubsite/screenshots/{desktop,mobile}/
 *
 * Idempotent — uses upsert so re-runs overwrite existing files.
 */
import fs from 'node:fs';
import path from 'node:path';

const PROJECT_ID = 'lzvvfmkwrvkfymmvosgl';
const BUCKET = 'public-assets';
const STORAGE_BASE = `https://${PROJECT_ID}.supabase.co/storage/v1`;
const PUBLIC_BASE = `${STORAGE_BASE}/object/public/${BUCKET}`;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY env var is required');
  process.exit(1);
}

const ROOT = path.resolve(import.meta.dirname, '..');
const OPTIMIZED_DIR = path.join(ROOT, 'docs/assets/screenshots/optimized');

async function uploadFile(filePath: string, storagePath: string) {
  const body = fs.readFileSync(filePath);

  const res = await fetch(`${STORAGE_BASE}/object/${BUCKET}/${storagePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'image/webp',
      'x-upsert': 'true',
    },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Upload failed for ${storagePath}: ${res.status} ${text}`);
  }

  const publicUrl = `${PUBLIC_BASE}/${storagePath}`;
  console.log(`  ${path.basename(filePath)} → ${publicUrl}`);
}

async function main() {
  let count = 0;

  for (const folder of ['desktop', 'mobile']) {
    const dir = path.join(OPTIMIZED_DIR, folder);
    if (!fs.existsSync(dir)) {
      console.warn(`Skipping ${folder}/ — directory not found. Run optimize-screenshots.ts first.`);
      continue;
    }

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp'));
    console.log(`\n${folder}/ (${files.length} files):`);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const storagePath = `pubsite/screenshots/${folder}/${file}`;
      await uploadFile(filePath, storagePath);
      count++;
    }
  }

  console.log(`\nDone: ${count} files uploaded to Supabase`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
