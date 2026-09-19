import { Test, TestingModule } from '@nestjs/testing';
import '@grpc/proto-loader';
import '@grpc/grpc-js'
import { GlobalGrpcExceptionFilter } from '../src/infrastructure/grpc/grpc.filter.js';
import { INestMicroservice } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from '../src/app/app.module.js';
import { AuthServiceClient } from '@juice11-micro/contracts';
import {
  grpcPackages,
  grpcProtoPaths,
} from '../src/infrastructure/grpc/gprc.options.js';
import getFreePort from 'get-port';
import { MyConfigService } from '../src/config/config.service.js';
import { AuthGrpc } from '../src/modules/auth/auth.client.js';
import { GrpcToPromise } from '../src/shared/types/index.js';
import { AuthController } from '../src/modules/auth/auth.controller.js';

// TODO: add separate database for testing
// TODO: add more scenarios
describe('Auth gRPC (e2e)', () => {
  let app: INestMicroservice;
  let wrapper: AuthGrpc;
  let client: GrpcToPromise<AuthServiceClient>;
  let controller: AuthController;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('regiter()', () => {
    it('should return tokens for newly created user', async () => {
      const dto = AuthFixtures.registerDto();
      const result = await client.register({ ...dto });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('login()', () => {
    it('should return tokens for existing user', async () => {
      const dto = AuthFixtures.registerDto();
      await client.register({ ...dto });

      const result = await client.login({ ...dto });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('refreshTokens()', () => {
    it('should return tokens for existing user', async () => {
      const dto = AuthFixtures.registerDto();
      const { refreshToken } = await client.register({ ...dto });

      const result = await client.refreshTokens({ refreshToken });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });

  describe('logout()', () => {
    it('should return tokens for existing user', async () => {
      const dto = AuthFixtures.registerDto();
      const { refreshToken } = await client.register({ ...dto });

      const result = await client.logout({ refreshToken });

      expect(result).toEqual({});
    });
  });

  describe('Unauthenticated errors', () => {
    it.each([
      {
        method: 'login',
        call: () => {
          const user = UserFixtures.entity();
          return client.login({ email: user.email, password: UserFixtures.password() })
        }
      },
      {
        method: 'refreshTokens',
        call: () => {
          return client.refreshTokens({ refreshToken: TokenFixtures.tokens().refreshToken })
        }
      },
      {
        method: 'refresh',
        field: 'refreshToken',
        call: () => {
          const dto = AuthFixtures.refreshDto({ refreshToken: 'invalid-token' });
          return client.refreshTokens({ ...dto });
        }
      },
      {
        method: 'logout',
        field: 'refreshToken',
        call: () => {
          const dto = AuthFixtures.refreshDto({ refreshToken: 'invalid-token' });
          return client.logout({ ...dto });
        }
      },
    ])(
      'should return gRPC Unauthenticated error when $method target does not exist',
      async ({ call }) => {
        await expect(call()).rejects.toMatchObject({
          code: 16,
          details: expect.stringContaining('Invalid'),
        });
      },
    );
  });

  describe('Validation errors', () => {
    it.each([
      {
        method: 'register',
        field: 'email',
        call: () => {
          const dto = AuthFixtures.registerDto({ email: 'invalid-email' });
          return client.register({ ...dto });
        }
      },
      {
        method: 'login',
        field: 'email',
        call: () => {
          const dto = AuthFixtures.loginDto({ email: 'invalid-email' });
          return client.login({ ...dto });
        }
      },
    ])(
      'should return gRPC INVALID_ARGUMENT error when $method params are invalid',
      async ({ call, field }) => {
        await expect(call()).rejects.toMatchObject({
          code: 3,
          details: expect.stringContaining(field),
        });
      },
    );
  });
});
