import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module.js";
import { FavoriteFixtures } from "./fixtures/favorite.fixture.js";
import request from "supertest";
import { FavoritesServiceClient } from "@juice11-micro/contracts";
import { favoriteGrpcMock } from "./mocks/index.js";
import { GrpcToPromise } from "../src/shared/types/index.js";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "../src/infrastructure/http/http.filter.js";
import { MyLogger } from "../src/infrastructure/logger/logger.service.js";
import { MyValidationPipe } from "../src/shared/utils/validate-dto.js";
import { ActivityGrpc } from "../src/modules/activity/activity.client.js";

// TODO: add more scenarios
describe('Favorite gRPC (e2e)', () => {
  let app: INestApplication;
  let wrapper: ActivityGrpc;
  let client: GrpcToPromise<FavoritesServiceClient>;


  beforeAll(async () => {

    const mockActivityGrpc = {
      getClient: vi.fn().mockImplementation((entity: string) => {
        return favoriteGrpcMock.client;
      }),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ActivityGrpc)
      .useValue(mockActivityGrpc)
      .compile();

    app = moduleRef.createNestApplication();
    app.useLogger(new MyLogger());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new MyValidationPipe());

    app.use(cookieParser());
    wrapper = moduleRef.get<ActivityGrpc>(ActivityGrpc);
    client = wrapper.getClient('favorite');

    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  describe('checkUserFavorites()', () => {
    it('should return checked items', async () => {
      vi.mocked(client.checkFavorites).mockResolvedValueOnce(FavoriteFixtures.checkFavoriteResponse());
      const dto = FavoriteFixtures.checkFavoriteDto();
      const result = await request(app.getHttpServer()).get('/activity/favorites/check').query(dto);

      expect(result.body).toHaveProperty('results');
    });
  });

  describe('getUserFavorites()', () => {
    it('should return user favorite', async () => {
      vi.mocked(client.getUserFavorites).mockResolvedValueOnce(FavoriteFixtures.getUserFavoriteResponse());
      const dto = FavoriteFixtures.getUserFavoriteDto();
      const result = await request(app.getHttpServer()).get('/activity/favorites').query(dto);

      expect(result.body).toHaveProperty('itemIds');
    });
  });



  describe('Validation errors', () => {
    it.each([
      {
        method: 'checkFavorites',
        field: 'userId',
        call: async () => {
          const dto = FavoriteFixtures.checkFavoriteDto({ userId: '' });
          const res = await request(app.getHttpServer()).get('/activity/favorites/check').query(dto);
          return res.body;
        }
      },
      {
        method: 'getUserFavorites',
        field: 'userId',
        call: async () => {
          const dto = FavoriteFixtures.getUserFavoriteDto({ userId: '' });
          const res = await request(app.getHttpServer()).get('/activity/favorites').query(dto);
          return res.body;
        }
      },
    ])(
      'should return gRPC error when $method params are invalid',
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
