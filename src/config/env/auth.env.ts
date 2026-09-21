import { registerAs } from '@nestjs/config';
import { validateEnv } from '../../shared/utils/validate-env.js';
import { AuthConfig } from '../interfaces/auth.interface.js';
import { AuthValidator } from '../validators/auth.validator.js';

// Loader for auth env
export const authEnv = registerAs<AuthConfig>('auth', () => {
  const env = validateEnv(process.env, AuthValidator);
  return {
    host: env.AUTH_HOST,
    port: env.AUTH_PORT,
  };
});
