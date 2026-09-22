import { registerAs } from '@nestjs/config';
import { validateEnv } from '../../shared/utils/validate-env.js';
import { ActivityConfig } from '../interfaces/activity.interface.js';
import { ActivityValidator } from '../validators/activity.validator.js';

// Loader for activity env
export const activityEnv = registerAs<ActivityConfig>('activity', () => {
  const env = validateEnv(process.env, ActivityValidator);
  return {
    host: env.ACTIVITY_HOST,
    port: env.ACTIVITY_PORT,
  };
});
