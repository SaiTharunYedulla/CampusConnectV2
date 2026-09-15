export function getMediaUrl(storageKey: string): string {
  if (!storageKey) return '#';
  if (storageKey.startsWith('http://') || storageKey.startsWith('https://')) {
    return storageKey;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://zxqyfubwaycspjepqwcl.supabase.co';
  const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET_NAME ?? 'achievements';
  const cleanKey = storageKey.replace(/^\//, '');
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${cleanKey}`;
}
