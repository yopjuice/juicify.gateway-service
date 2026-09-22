import { ActivityConfig } from './activity.interface.js';
import { AuthConfig } from './auth.interface.js';
import { CatalogConfig } from './catalog.interface.js';
import { HttpConfig } from './http.interface.js';

export interface AllConfigs {
  auth: AuthConfig;
  http: HttpConfig;
  catalog: CatalogConfig;
  activity: ActivityConfig;
}
