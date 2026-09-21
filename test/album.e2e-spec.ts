import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module.js";
import { AlbumFixtures } from "./fixtures/album.fixture.js";
import request from "supertest";
import { AlbumServiceClient } from "@juice11-micro/contracts";
import { albumGrpcMock, trackGrpcMock } from "./mocks/index.js";
import { GrpcToPromise } from "../src/shared/types/index.js";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "../src/infrastructure/http/http.filter.js";
import { MyLogger } from "../src/infrastructure/logger/logger.service.js";
import { MyValidationPipe } from "../src/shared/utils/validate-dto.js";
import { CatalogGrpc } from "../src/modules/catalog/catalog.client.js";

// TODO: add more scenarios
describe('Album gRPC (e2e)', () => {
  let app: INestApplication;
  let wrapper: CatalogGrpc;
  let client: GrpcToPromise<AlbumServiceClient>;


  beforeAll(async () => {

    const mockCatalogGrpc = {
      getClient: vi.fn().mockImplementation((entity: string) => {
        return albumGrpcMock.client;
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
    client = wrapper.getClient('album');

    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  describe('create()', () => {
    it('should return newly created album', async () => {
      vi.mocked(client.createAlbum).mockResolvedValueOnce(AlbumFixtures.createResponse());
      const dto = AlbumFixtures.createDto();
      const result = await request(app.getHttpServer()).post('/catalog/albums').send(dto);

      expect(result.body).toHaveProperty('album');
    });
  });

  describe('get()', () => {
    it('should return one album', async () => {
      vi.mocked(client.getAlbum).mockResolvedValueOnce(AlbumFixtures.getResponse());
      const result = await request(app.getHttpServer()).get('/catalog/albums/123');

      expect(result.body).toHaveProperty('album');
    });
  });

  describe('list()', () => {
    it('should return a list of  albums', async () => {
      vi.mocked(client.listAlbums).mockResolvedValueOnce(AlbumFixtures.listResponse());
      const result = await request(app.getHttpServer()).get('/catalog/albums');

      expect(result.body).toHaveProperty('albums');
    });
  });


  describe('update()', () => {
    it('should return updated album', async () => {
      vi.mocked(client.updateAlbum).mockResolvedValueOnce(AlbumFixtures.updateResponse());
      const dto = AlbumFixtures.updateDto();
      const result = await request(app.getHttpServer()).put('/catalog/albums/123').send(dto);

      expect(result.body).toHaveProperty('album');
    });
  });

  describe('delete()', () => {
    it('should return ok = true', async () => {
      vi.mocked(client.deleteAlbum).mockResolvedValueOnce({});
      const result = await request(app.getHttpServer()).delete('/catalog/albums/123');

      expect(result.body).toHaveProperty('ok');
      expect(result.body.ok).toBe(true);
    });
  });


  describe('Validation errors', () => {
    it.each([
      {
        method: 'create',
        field: 'type',
        call: async () => {
          const dto = AlbumFixtures.createDto({ type: 1 as any });
          const res = await request(app.getHttpServer()).post('/catalog/albums').send(dto);
          return res.body;
        }
      },
      {
        method: 'update',
        field: 'type',
        call: async () => {
          const dto = AlbumFixtures.updateDto({ type: 'invalid-type' as any });
          const res = await request(app.getHttpServer()).put('/catalog/albums/123').send(dto);
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
