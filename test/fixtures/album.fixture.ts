import { AlbumType, CreateAlbumResponse, GetAlbumResponse, ListAlbumsResponse, UpdateAlbumResponse } from '@juice11-micro/contracts';
import { CreateAlbumDto, CreateAlbumInput } from '../../src/modules/catalog/dto/create-album.dto.js';
import { UpdateAlbumInput } from '../../src/modules/catalog/dto/update-album.dto.js';

const baseAlbum = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  title: 'Greatest Album',
  releaseDate: '1970-01-01T00:00:00.000Z',
  coverUrl: 'https://example.com',
  type: AlbumType.EP,
  artistId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const AlbumFixtures = {
  // Get valid UUID
  uuid: (): string => baseAlbum.id,

  createDto: (overrides?: Partial<CreateAlbumDto>): CreateAlbumDto => ({
    title: baseAlbum.title,
    releaseDate: baseAlbum.releaseDate,
    type: baseAlbum.type,
    coverUrl: baseAlbum.coverUrl,
    artistId: baseAlbum.artistId,
    ...overrides,
  }),

  updateDto: (overrides?: Partial<UpdateAlbumInput>): UpdateAlbumInput => ({
    title: 'updated title',
    ...overrides,
  }),

  createResponse: (overrides?: Partial<CreateAlbumResponse>): CreateAlbumResponse => ({
    album: {
      ...baseAlbum,
      ...overrides,
    }
  }),

  updateResponse: (overrides?: Partial<UpdateAlbumResponse>): UpdateAlbumResponse => ({
    album: {
      ...baseAlbum,
      ...overrides,
    }
  }),

  getResponse: (overrides?: Partial<GetAlbumResponse>): GetAlbumResponse => ({
    album: {
      ...baseAlbum,
      tracks: [],
      genreId: AlbumFixtures.uuid(),
      ...overrides,
    }
  }),

  listResponse: (overrides?: Partial<ListAlbumsResponse>): ListAlbumsResponse => ({

    albums: Array.from({ length: 2 }, (_, i) => ({
      ...baseAlbum,
      ...overrides,
    }))

  })
};
