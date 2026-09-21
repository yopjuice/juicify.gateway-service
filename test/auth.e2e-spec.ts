import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module.js";
import { AuthFixtures } from "./fixtures/auth.fixture.js";
import { AuthGrpc } from "../src/modules/auth/auth.client.js";
import request from "supertest";
import { AuthServiceClient } from "@juice11-micro/contracts";
import { authGrpcMock } from "./mocks/index.js";
import { GrpcToPromise } from "../src/shared/types/index.js";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "../src/infrastructure/http/http.filter.js";
import { MyLogger } from "../src/infrastructure/logger/logger.service.js";
import { MyValidationPipe } from "../src/shared/utils/validate-dto.js";
import { UnauthenticatedError } from "../src/shared/errors/domain-errors.js";

// TODO: add more scenarios
describe('Auth gRPC (e2e)', () => {
  let app: INestApplication;
  let wrapper: AuthGrpc;
  let client: GrpcToPromise<AuthServiceClient>;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AuthGrpc)
      .useValue(authGrpcMock)
      .compile();

    app = moduleRef.createNestApplication();
    app.useLogger(new MyLogger());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new MyValidationPipe());

    app.use(cookieParser());
    wrapper = moduleRef.get<AuthGrpc>(AuthGrpc);
    client = wrapper.client;

    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  describe('regiter()', () => {
    it('should return tokens for newly created user', async () => {
      vi.mocked(client.register).mockResolvedValueOnce(AuthFixtures.authTokens());
      const dto = AuthFixtures.registerDto();
      const result = await request(app.getHttpServer()).post('/auth/register').send(dto);

      expect(result.body).toHaveProperty('accessToken');
      expect(result.body).toHaveProperty('refreshToken');
    });
  });

  describe('login()', () => {
    it('should return tokens on login', async () => {
      vi.mocked(client.login).mockResolvedValueOnce(AuthFixtures.authTokens());
      const dto = AuthFixtures.loginDto();
      const result = await request(app.getHttpServer()).post('/auth/login').send(dto);

      expect(result.body).toHaveProperty('accessToken');
      expect(result.body).toHaveProperty('refreshToken');
    });
  });

  describe('refreshTokens()', () => {
    it('should return tokens on refresh', async () => {
      vi.mocked(client.refreshTokens).mockResolvedValueOnce(AuthFixtures.authTokens());
      const dto = AuthFixtures.refreshDto();
      const result = await request(app.getHttpServer())
        .post('/auth/refresh')
        .set('Cookie', 'refreshToken=some-old-valid-token-123')
        .send(dto);

      expect(result.body).toHaveProperty('accessToken');
      expect(result.body).toHaveProperty('refreshToken');
    });
  });

  describe('logout()', () => {
    it('should return true on logout', async () => {
      vi.mocked(client.logout).mockResolvedValueOnce(AuthFixtures.authTokens());
      const dto = AuthFixtures.logoutDto();
      request(app.getHttpServer()).post('/auth/logout').send(dto).expect({ ok: true });
    });
  });

  describe('Unauthenticated errors', () => {
    it.each([
      {
        method: 'login',
        endpoint: '/auth/login',
        grpcMethod: 'login' as const,
        getDto: () => AuthFixtures.loginDto(),
      },
    ])(
      'should return gRPC Unauthenticated error when $method target does not exist',
      async ({ endpoint, grpcMethod, getDto }) => {

        vi.mocked(client[grpcMethod]).mockRejectedValueOnce(new UnauthenticatedError());

        const res = await request(app.getHttpServer())
          .post(endpoint)
          .send(getDto());

        expect(res.body).toMatchObject({
          "error": "UnauthenticatedError",
          "message": "Authentication required",
          "statusCode": 401,
          "timestamp": expect.any(String),
        });
      },
    );
  });

  describe('Validation errors', () => {
    it.each([
      {
        method: 'register',
        field: 'email',
        call: async () => {
          const dto = AuthFixtures.registerDto({ email: 'invalid-email' });
          const res = await request(app.getHttpServer()).post('/auth/register').send(dto);
          return res.body;
        }
      },
      {
        method: 'login',
        field: 'email',
        call: async () => {
          const dto = AuthFixtures.loginDto({ email: 'invalid-email' });
          const res = await request(app.getHttpServer()).post('/auth/login').send(dto);
          return res.body;
        }
      },
    ])(
      'should return gRPC RpcException error when $method params are invalid',
      async ({ call, field }) => {
        await expect(call()).resolves.toMatchObject({
          "error": "RpcException",
          "message": expect.stringContaining(field),
          "statusCode": 500,
          "timestamp": expect.any(String),
        });
      },
    );
  });
});
