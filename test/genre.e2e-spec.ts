import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../src/app/app.module.js";
import { GenreFixtures } from "./fixtures/genre.fixture.js";
import request from "supertest";
import { GenreServiceClient } from "@juice11-micro/contracts";
import { genreGrpcMock } from "./mocks/index.js";
import { GrpcToPromise } from "../src/shared/types/index.js";
import cookieParser from "cookie-parser";
import { HttpExceptionFilter } from "../src/infrastructure/http/http.filter.js";
import { MyLogger } from "../src/infrastructure/logger/logger.service.js";
import { MyValidationPipe } from "../src/shared/utils/validate-dto.js";
import { CatalogGrpc } from "../src/modules/catalog/catalog.client.js";

// TODO: add more scenarios
describe('Genre gRPC (e2e)', () => {
  let app: INestApplication;
  let wrapper: CatalogGrpc;
  let client: GrpcToPromise<GenreServiceClient>;


  beforeAll(async () => {

    const mockCatalogGrpc = {
      getClient: vi.fn().mockImplementation((entity: string) => {
        return genreGrpcMock.client;
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
    client = wrapper.getClient('genre');

    await app.init();
  });


  afterAll(async () => {
    await app.close();
  });

  describe('create()', () => {
    it('should return newly created genre', async () => {
      vi.mocked(client.createGenre).mockResolvedValueOnce(GenreFixtures.createResponse());
      const dto = GenreFixtures.createDto();
      const result = await request(app.getHttpServer()).post('/catalog/genres').send(dto);

      expect(result.body).toHaveProperty('genre');
    });
  });

  describe('get()', () => {
    it('should return one genre', async () => {
      vi.mocked(client.getGenre).mockResolvedValueOnce(GenreFixtures.getResponse());
      const result = await request(app.getHttpServer()).get('/catalog/genres/123');

      expect(result.body).toHaveProperty('genre');
    });
  });

  describe('list()', () => {
    it('should return a list of  genres', async () => {
      vi.mocked(client.listGenres).mockResolvedValueOnce(GenreFixtures.listResponse());
      const result = await request(app.getHttpServer()).get('/catalog/genres');

      expect(result.body).toHaveProperty('genres');
    });
  });


  describe('update()', () => {
    it('should return updated genre', async () => {
      vi.mocked(client.updateGenre).mockResolvedValueOnce(GenreFixtures.updateResponse());
      const dto = GenreFixtures.updateDto();
      const result = await request(app.getHttpServer()).put('/catalog/genres/123').send(dto);

      expect(result.body).toHaveProperty('genre');
    });
  });

  describe('delete()', () => {
    it('should return ok = true', async () => {
      vi.mocked(client.deleteGenre).mockResolvedValueOnce({});
      const result = await request(app.getHttpServer()).delete('/catalog/genres/123');

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
          const dto = GenreFixtures.createDto({ name: '' });
          const res = await request(app.getHttpServer()).post('/catalog/genres').send(dto);
          return res.body;
        }
      },
      {
        method: 'update',
        field: 'name',
        call: async () => {
          const dto = GenreFixtures.updateDto({ name: '' });
          const res = await request(app.getHttpServer()).put('/catalog/genres/123').send(dto);
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
