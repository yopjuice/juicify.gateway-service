import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module.js';
import { INestApplication } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from '../src/infrastructure/http/http.filter.js';
import { MyLogger } from '../src/infrastructure/logger/logger.service.js';
import { MyValidationPipe } from '../src/shared/utils/validate-dto.js';

describe('App', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication();
    app.useLogger(new MyLogger());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new MyValidationPipe());

    app.use(cookieParser());
    await app.init();
  });

  it(`GET /health`, async () => {
    const res = await request(app.getHttpServer())
      .get('/health')
      .expect(200);

    expect(res.body).toEqual({ status: 'ok', timestamp: expect.any(String) });
    expect(Date.parse(res.body.timestamp)).not.toBeNaN();
  });

  afterAll(async () => {
    await app.close();
  });
});

