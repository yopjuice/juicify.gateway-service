import {Module} from '@nestjs/common';
import { MyConfigModule } from "../config/config.module.js";
import { AuthModule } from "../modules/auth/auth.module.js";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";

@Module({
  imports: [
    MyConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
