import { AuthConfig } from './auth.interface.js';
import { HttpConfig } from './http.interface.js';

export interface AllConfigs {
  auth: AuthConfig;
  http: HttpConfig;
}
