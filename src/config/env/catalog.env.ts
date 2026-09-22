import { registerAs } from '@nestjs/config';
import { validateEnv } from '../../shared/utils/validate-env.js';
import { CatalogConfig } from '../interfaces/catalog.interface.js';
import { CatalogValidator } from '../validators/catalog.validator.js';

// Loader for catalog env
export const catalogEnv = registerAs<CatalogConfig>('catalog', () => {
  const env = validateEnv(process.env, CatalogValidator);
  return {
    host: env.CATALOG_HOST,
    port: env.CATALOG_PORT,
  };
});
