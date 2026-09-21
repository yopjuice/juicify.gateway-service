import { registerAs } from '@nestjs/config';
import { validateEnv } from '../../shared/utils/validate-env.js';
import type { HttpConfig } from '../interfaces/http.interface.js';
import { HttpValidator } from '../validators/http.validator.js';

// Loader for http env
export const httpEnv = registerAs<HttpConfig>('http', () => {
  const env = validateEnv(process.env, HttpValidator);
  return {
    host: env.HTTP_HOST,
    port: env.HTTP_PORT,
  };
});
