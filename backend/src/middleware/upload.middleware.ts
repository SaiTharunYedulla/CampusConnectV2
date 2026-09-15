import multer from 'multer';
import { config } from '@/config';
import { BadRequestError } from '@/types';

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'video/mp4',
  'video/webm',
]);

const MAX_FILE_SIZE = config.MAX_FILE_SIZE_MB * 1024 * 1024;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits:  { fileSize: MAX_FILE_SIZE },
  fileFilter(_req, file, cb) {
    if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestError(
          `File type "${file.mimetype}" is not allowed. Accepted: JPEG, PNG, WebP, PDF, MP4, WebM`,
        ) as unknown as null,
        false,
      );
    }
  },
});

/** Single file with field name "proof" (for account verification) */
export const uploadProof = upload.single('proof');

/** Up to 5 evidence files for achievement posts */
export const uploadEvidence = upload.array('evidence', 5);

/** Single profile photo */
export const uploadPhoto = upload.single('photo');
