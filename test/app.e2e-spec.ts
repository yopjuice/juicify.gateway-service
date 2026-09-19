import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app/app.module.js';
import { INestApplication } from '@nestjs/common';

describe('App', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication();
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

