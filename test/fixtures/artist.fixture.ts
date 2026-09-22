import { CreateArtistResponse, UpdateArtistResponse, GetArtistResponse, ListArtistsResponse } from "@juice11-micro/contracts";
import { CreateArtistDto } from "../../src/modules/catalog/dto/create-artist.dto.js";
import { UpdateArtistDto } from "../../src/modules/catalog/dto/update-artist.dto.js";

// Default database object
const baseArtist = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  name: 'juice11',
  isVerified: false,
  biography: 'The greatest artist of all time',
  avatarUrl: 'https://i.imgur.com/wSTFkRM.png',
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const ArtistFixtures = {
  // Get valid UUID
  uuid: (): string => baseArtist.id,

  createDto: (overrides?: Partial<CreateArtistDto>): CreateArtistDto => ({
    name: baseArtist.name,
    isVerified: baseArtist.isVerified,
    biography: baseArtist.biography,
    avatarUrl: baseArtist.avatarUrl,
    ...overrides,
  }),

  updateDto: (overrides?: Partial<UpdateArtistDto>): UpdateArtistDto => ({
    name: 'updated name',
    ...overrides,
  }),

  createResponse: (overrides?: Partial<CreateArtistResponse>): CreateArtistResponse => ({
    artist: {
      ...baseArtist,
      ...overrides,
    }
  }),

  updateResponse: (overrides?: Partial<UpdateArtistResponse>): UpdateArtistResponse => ({
    artist: {
      ...baseArtist,
      ...overrides,
    }
  }),

  getResponse: (overrides?: Partial<GetArtistResponse>): GetArtistResponse => ({
    artist: {
      ...baseArtist,
      tracks: [],
      albums: [],
      ...overrides,
    }
  }),

  listResponse: (overrides?: Partial<ListArtistsResponse>): ListArtistsResponse => ({

    artists: Array.from({ length: 2 }, (_, i) => ({
      ...baseArtist,
      ...overrides,
    }))

  })
};
