import { z } from 'zod';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// ─── Env schema validation ────────────────────────────────────────────────────
const envSchema = z.object({
  DATABASE_URL:             z.string().min(1, 'DATABASE_URL is required'),
  SUPABASE_URL:             z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_ROLE_KEY:z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  SUPABASE_BUCKET_NAME:     z.string().default('campusconnect'),
  JWT_ACCESS_SECRET:        z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 chars'),
  JWT_REFRESH_SECRET:       z.string().min(16, 'JWT_REFRESH_SECRET must be at least 16 chars'),
  JWT_ACCESS_EXPIRES_IN:    z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN:   z.string().default('7d'),
  BCRYPT_ROUNDS:            z.coerce.number().default(12),
  ADMIN_EMAIL:              z.string().email(),
  ADMIN_PASSWORD:           z.string().min(8),
  PORT:                     z.coerce.number().default(5000),
  NODE_ENV:                 z.enum(['development', 'production', 'test']).default('development'),
  FRONTEND_URL:             z.string().url(),
  MAX_FILE_SIZE_MB:         z.coerce.number().default(10),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  parsed.error.issues.forEach((issue) => {
    console.error(`  ${issue.path.join('.')}: ${issue.message}`);
  });
  process.exit(1);
}

export const config = parsed.data;

// ─── Supabase client (service role — server-side only) ───────────────────────
const supabase = createClient(config.SUPABASE_URL, config.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

// ─── Storage helpers ─────────────────────────────────────────────────────────

/**
 * Upload a buffer to Supabase Storage and return the public URL.
 */
export async function uploadToStorage(
  key: string,
  buffer: Buffer,
  mimeType: string,
): Promise<string> {
  const { error } = await supabase.storage
    .from(config.SUPABASE_BUCKET_NAME)
    .upload(key, buffer, {
      contentType:  mimeType,
      upsert:       false,
    });

  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from(config.SUPABASE_BUCKET_NAME)
    .getPublicUrl(key);

  return data.publicUrl;
}

/**
 * Delete a file from Supabase Storage.
 */
export async function deleteFromStorage(key: string): Promise<void> {
  const { error } = await supabase.storage
    .from(config.SUPABASE_BUCKET_NAME)
    .remove([key]);

  if (error) throw new Error(`Storage delete failed: ${error.message}`);
}

/**
 * Create a signed (time-limited) URL for private files.
 * @param expiresIn seconds until expiry (default: 3600 = 1 hour)
 */
export async function getSignedUrl(key: string, expiresIn = 3600): Promise<string> {
  const { data, error } = await supabase.storage
    .from(config.SUPABASE_BUCKET_NAME)
    .createSignedUrl(key, expiresIn);

  if (error || !data) throw new Error(`Signed URL failed: ${error?.message}`);
  return data.signedUrl;
}
