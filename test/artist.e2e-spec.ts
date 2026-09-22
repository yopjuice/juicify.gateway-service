import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module.js";
import { ArtistFixtures } from "./fixtures/artist.fixture.js";
import request from "supertest";
import { ArtistServiceClient } from "@juice11-micro/contracts";
import { artistGrpcMock } from "./mocks/index.js";
import { GrpcToPromise } from "../src/shared/types/index.js";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "../src/infrastructure/http/http.filter.js";
import { MyLogger } from "../src/infrastructure/logger/logger.service.js";
import { MyValidationPipe } from "../src/shared/utils/validate-dto.js";
import { CatalogGrpc } from "../src/modules/catalog/catalog.client.js";

// TODO: add more scenarios
describe('Artist gRPC (e2e)', () => {
  let app: INestApplication;
  let wrapper: CatalogGrpc;
  let client: GrpcToPromise<ArtistServiceClient>;


  beforeAll(async () => {

    const mockCatalogGrpc = {
      getClient: vi.fn().mockImplementation((entity: string) => {
        return artistGrpcMock.client;
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
    client = wrapper.getClient('artist');

    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  describe('create()', () => {
    it('should return newly created artist', async () => {
      vi.mocked(client.createArtist).mockResolvedValueOnce(ArtistFixtures.createResponse());
      const dto = ArtistFixtures.createDto();
      const result = await request(app.getHttpServer()).post('/catalog/artists').send(dto);

      expect(result.body).toHaveProperty('artist');
    });
  });

  describe('get()', () => {
    it('should return one artist', async () => {
      vi.mocked(client.getArtist).mockResolvedValueOnce(ArtistFixtures.getResponse());
      const result = await request(app.getHttpServer()).get('/catalog/artists/123');

      expect(result.body).toHaveProperty('artist');
    });
  });

  describe('list()', () => {
    it('should return a list of  artists', async () => {
      vi.mocked(client.listArtists).mockResolvedValueOnce(ArtistFixtures.listResponse());
      const result = await request(app.getHttpServer()).get('/catalog/artists');

      expect(result.body).toHaveProperty('artists');
    });
  });


  describe('update()', () => {
    it('should return updated artist', async () => {
      vi.mocked(client.updateArtist).mockResolvedValueOnce(ArtistFixtures.updateResponse());
      const dto = ArtistFixtures.updateDto();
      const result = await request(app.getHttpServer()).put('/catalog/artists/123').send(dto);

      expect(result.body).toHaveProperty('artist');
    });
  });

  describe('delete()', () => {
    it('should return ok = true', async () => {
      vi.mocked(client.deleteArtist).mockResolvedValueOnce({});
      const result = await request(app.getHttpServer()).delete('/catalog/artists/123');

      expect(result.body).toHaveProperty('ok');
      expect(result.body.ok).toBe(true);
    });
  });


  describe('Validation errors', () => {
    it.each([
      {
        method: 'create',
        field: 'name',
        call: async () => {
          const dto = ArtistFixtures.createDto({ name: '' });
          const res = await request(app.getHttpServer()).post('/catalog/artists').send(dto);
          return res.body;
        }
      },
      {
        method: 'update',
        field: 'name',
        call: async () => {
          const dto = ArtistFixtures.updateDto({ name: '' });
          const res = await request(app.getHttpServer()).put('/catalog/artists/123').send(dto);
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
