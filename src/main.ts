import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module.js';
import { MyConfigService } from './config/config.service.js';
import { MyValidationPipe } from './shared/utils/validate-dto.js';
import { MyLogger } from './infrastructure/logger/logger.service.js';
import { HttpExceptionFilter } from './infrastructure/http/http.filter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(MyConfigService);
  const port = config.get('http.port');

  app.useLogger(new MyLogger());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new MyValidationPipe());

  await app.listen(port);
}
await bootstrap();
