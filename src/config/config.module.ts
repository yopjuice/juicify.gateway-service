import { Global, Module } from '@nestjs/common';
import { MyConfigService } from './config.service.js';
import { ConfigModule } from '@nestjs/config';
import { httpEnv } from './env/http.env.js';
import { authEnv } from './env/auth.env.js';
import { catalogEnv } from './env/catalog.env.js';
import { activityEnv } from './env/activity.env.js';

// Making this module global to call service easier
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // Loads namespaces (e.x. database.url)
      load: [authEnv, httpEnv, catalogEnv, activityEnv],
    }),
  ],
  providers: [MyConfigService],
  exports: [MyConfigService],
})
export class MyConfigModule { }
