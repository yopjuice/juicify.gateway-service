import { CreateGenreResponse, UpdateGenreResponse, GetGenreResponse, ListGenresResponse } from "@juice11-micro/contracts";
import { CreateGenreDto } from "../../src/modules/catalog/dto/create-genre.dto.js";
import { UpdateGenreDto } from "../../src/modules/catalog/dto/update-genre.dto.js";

const baseGenre = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  name: 'juice11',
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const GenreFixtures = {
  // Get valid UUID
  uuid: (): string => baseGenre.id,

  createDto: (overrides?: Partial<CreateGenreDto>): CreateGenreDto => ({
    name: baseGenre.name,
    ...overrides,
  }),

  updateDto: (overrides?: Partial<UpdateGenreDto>): UpdateGenreDto => ({
    name: 'updated name',
    ...overrides,
  }),

  createResponse: (overrides?: Partial<CreateGenreResponse>): CreateGenreResponse => ({
    genre: {
      ...baseGenre,
      ...overrides,
    }
  }),

  updateResponse: (overrides?: Partial<UpdateGenreResponse>): UpdateGenreResponse => ({
    genre: {
      ...baseGenre,
      ...overrides,
    }
  }),

  getResponse: (overrides?: Partial<GetGenreResponse>): GetGenreResponse => ({
    genre: {
      ...baseGenre,
      tracks: [],
      albums: [],
      ...overrides,
    }
  }),

  listResponse: (overrides?: Partial<ListGenresResponse>): ListGenresResponse => ({

    genres: Array.from({ length: 2 }, (_, i) => ({
      ...baseGenre,
      ...overrides,
    }))

  })
};
