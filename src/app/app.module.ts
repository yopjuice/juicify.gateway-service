import {Module} from '@nestjs/common';
import { MyConfigModule } from "../config/config.module.js";
import { AuthModule } from "../modules/auth/auth.module.js";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { CatalogModule } from '../modules/catalog/catalog.module.js';

@Module({
  imports: [
    MyConfigModule,
    AuthModule,
    CatalogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
