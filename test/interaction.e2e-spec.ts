import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module.js";
import { InteractionFixtures } from "./fixtures/interaction.fixture.js";
import request from "supertest";
import { InteractionServiceClient } from "@juice11-micro/contracts";
import { interactionGrpcMock } from "./mocks/index.js";
import { GrpcToPromise } from "../src/shared/types/index.js";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "../src/infrastructure/http/http.filter.js";
import { MyLogger } from "../src/infrastructure/logger/logger.service.js";
import { MyValidationPipe } from "../src/shared/utils/validate-dto.js";
import { ActivityGrpc } from "../src/modules/activity/activity.client.js";

// TODO: add more scenarios
describe('Interaction gRPC (e2e)', () => {
  let app: INestApplication;
  let wrapper: ActivityGrpc;
  let client: GrpcToPromise<InteractionServiceClient>;


  beforeAll(async () => {

    const mockActivityGrpc = {
      getClient: vi.fn().mockImplementation((entity: string) => {
        return interactionGrpcMock.client;
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
    client = wrapper.getClient('interaction');

    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  describe('getUserActivity()', () => {
    it('should return user interaction', async () => {
      vi.mocked(client.getUserActivity).mockResolvedValueOnce(InteractionFixtures.getUserActivityResponse());
      const dto = InteractionFixtures.getUserActivityDto();
      const result = await request(app.getHttpServer()).get('/activity/interactions').query(dto);

      expect(result.body).toHaveProperty('logs');
    });
  });



  describe('Validation errors', () => {
    it.each([
      {
        method: 'getUserActivity',
        field: 'userId',
        call: async () => {
          const dto = InteractionFixtures.getUserActivityDto({ userId: '' });
          const res = await request(app.getHttpServer()).get('/activity/interactions').query(dto);
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
