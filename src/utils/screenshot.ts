const BASE =
  'https://lzvvfmkwrvkfymmvosgl.supabase.co/storage/v1/object/public/public-assets/pubsite/screenshots';

export function screenshotUrl(path: string): string {
  return `${BASE}/${path}`;
}
