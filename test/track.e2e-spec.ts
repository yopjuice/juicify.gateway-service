import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module.js";
import { TrackFixtures } from "./fixtures/track.fixture.js";
import request from "supertest";
import { TrackServiceClient } from "@juice11-micro/contracts";
import { trackGrpcMock } from "./mocks/index.js";
import { GrpcToPromise } from "../src/shared/types/index.js";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "../src/infrastructure/http/http.filter.js";
import { MyLogger } from "../src/infrastructure/logger/logger.service.js";
import { MyValidationPipe } from "../src/shared/utils/validate-dto.js";
import { CatalogGrpc } from "../src/modules/catalog/catalog.client.js";

// TODO: add more scenarios
describe('Track gRPC (e2e)', () => {
  let app: INestApplication;
  let wrapper: CatalogGrpc;
  let client: GrpcToPromise<TrackServiceClient>;


  beforeAll(async () => {

    const mockCatalogGrpc = {
      getClient: vi.fn().mockImplementation((entity: string) => {
        return trackGrpcMock.client;
      }),
    };

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(CatalogGrpc)
      .useValue(mockCatalogGrpc)
      .compile();

    app = moduleRef.createNestApplication();
    app.useLogger(new MyLogger());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(new MyValidationPipe());

    app.use(cookieParser());
    wrapper = moduleRef.get<CatalogGrpc>(CatalogGrpc);
    client = wrapper.getClient('track');

    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  describe('create()', () => {
    it('should return newly created track', async () => {
      vi.mocked(client.createTrack).mockResolvedValueOnce(TrackFixtures.createResponse());
      const dto = TrackFixtures.createDto();
      const result = await request(app.getHttpServer()).post('/catalog/tracks').send(dto);

      expect(result.body).toHaveProperty('track');
    });
  });

  describe('get()', () => {
    it('should return one track', async () => {
      vi.mocked(client.getTrack).mockResolvedValueOnce(TrackFixtures.getResponse());
      const result = await request(app.getHttpServer()).get('/catalog/tracks/123');

      expect(result.body).toHaveProperty('track');
    });
  });

  describe('list()', () => {
    it('should return a list of  tracks', async () => {
      vi.mocked(client.listTracks).mockResolvedValueOnce(TrackFixtures.listResponse());
      const result = await request(app.getHttpServer()).get('/catalog/tracks');

      expect(result.body).toHaveProperty('tracks');
    });
  });


  describe('update()', () => {
    it('should return updated track', async () => {
      vi.mocked(client.updateTrack).mockResolvedValueOnce(TrackFixtures.updateResponse());
      const dto = TrackFixtures.updateDto();
      const result = await request(app.getHttpServer()).put('/catalog/tracks/123').send(dto);

      expect(result.body).toHaveProperty('track');
    });
  });

  describe('delete()', () => {
    it('should return ok = true', async () => {
      vi.mocked(client.deleteTrack).mockResolvedValueOnce({});
      const result = await request(app.getHttpServer()).delete('/catalog/tracks/123');

      expect(result.body).toHaveProperty('ok');
      expect(result.body.ok).toBe(true);
    });
  });


  describe('Validation errors', () => {
    it.each([
      {
        method: 'create',
        field: 'title',
        call: async () => {
          const dto = TrackFixtures.createDto({ title: '' });
          const res = await request(app.getHttpServer()).post('/catalog/tracks').send(dto);
          return res.body;
        }
      },
      {
        method: 'update',
        field: 'title',
        call: async () => {
          const dto = TrackFixtures.updateDto({ title: '' });
          const res = await request(app.getHttpServer()).put('/catalog/tracks/123').send(dto);
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
