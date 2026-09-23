import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module.js";
import { StatsFixtures } from "./fixtures/stats.fixture.js";
import request from "supertest";
import { StatsServiceClient } from "@juice11-micro/contracts";
import { statsGrpcMock } from "./mocks/index.js";
import { GrpcToPromise } from "../src/shared/types/index.js";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "../src/infrastructure/http/http.filter.js";
import { MyLogger } from "../src/infrastructure/logger/logger.service.js";
import { MyValidationPipe } from "../src/shared/utils/validate-dto.js";
import { ActivityGrpc } from "../src/modules/activity/activity.client.js";

// TODO: add more scenarios
describe('Stats gRPC (e2e)', () => {
  let app: INestApplication;
  let wrapper: ActivityGrpc;
  let client: GrpcToPromise<StatsServiceClient>;


  beforeAll(async () => {

    const mockActivityGrpc = {
      getClient: vi.fn().mockImplementation((entity: string) => {
        return statsGrpcMock.client;
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
    client = wrapper.getClient('stats');

    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  describe('getTopItems()', () => {
    it('should return user stats', async () => {
      vi.mocked(client.getTopItems).mockResolvedValueOnce(StatsFixtures.getTopItemsResponse());
      const dto = StatsFixtures.getTopItemsDto();
      const result = await request(app.getHttpServer()).get('/activity/stats').query(dto);

      expect(result.body).toHaveProperty('items');
    });
  });



  describe('Validation errors', () => {
    it.each([
      {
        method: 'getTopItems',
        field: 'itemType',
        call: async () => {
          const dto = StatsFixtures.getTopItemsDto({ itemType: 'wrong type' as any });
          const res = await request(app.getHttpServer()).get('/activity/stats').query(dto);
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
