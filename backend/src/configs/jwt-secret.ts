import 'dotenv/config';

const jwtSecret = process.env.JWT_SECRET_ENV;

if (!jwtSecret) {
  throw new Error('JWT_SECRET_ENV is not set');
}

if (Buffer.byteLength(jwtSecret, 'utf8') < 32) {
  throw new Error('JWT_SECRET_ENV must be at least 32 bytes');
}

export const JWT_SECRET = jwtSecret;