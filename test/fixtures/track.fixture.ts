import { CreateTrackResponse, UpdateTrackResponse, GetTrackResponse, ListTracksResponse } from "@juice11-micro/contracts";
import { CreateTrackDto } from "../../src/modules/catalog/dto/create-track.dto.js";
import { UpdateTrackDto } from "../../src/modules/catalog/dto/update-track.dto.js";

const baseTrack = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  title: 'Track title',
  duration: 123,
  orderNumber: 1,
  trackId: null,
  artistId: 'cfd5-954f-46a1-bdb5-b4006a24ffcd',
  pathKey: 'path/to/track',
  coverUrl: 'path/to/cover',
  status: 'READY',
  isAvailable: true,
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
  updatedAt: new Date('1970-01-01T00:00:00.000Z'),
} as const;




export const TrackFixtures = {
  // Get valid UUID
  uuid: (): string => baseTrack.id,

  createDto: (overrides?: Partial<CreateTrackDto>): CreateTrackDto => ({
    title: baseTrack.title,
    orderNumber: baseTrack.orderNumber,
    artistId: baseTrack.artistId,
    pathKey: baseTrack.pathKey,
    coverUrl: baseTrack.coverUrl,
    duration: baseTrack.duration,
    ...overrides,
  }),

  updateDto: (overrides?: Partial<UpdateTrackDto>): UpdateTrackDto => ({
    title: 'updated title',
    ...overrides,
  }),

  createResponse: (overrides?: Partial<CreateTrackResponse>): CreateTrackResponse => ({
    track: {
      ...baseTrack,
      ...overrides,
    }
  }),

  updateResponse: (overrides?: Partial<UpdateTrackResponse>): UpdateTrackResponse => ({
    track: {
      ...baseTrack,
      ...overrides,
    }
  }),

  getResponse: (overrides?: Partial<GetTrackResponse>): GetTrackResponse => ({
    track: {
      ...baseTrack,
      artist: undefined,
      album: undefined,
      genres: [],
      ...overrides,
    }
  }),

  listResponse: (overrides?: Partial<ListTracksResponse>): ListTracksResponse => ({

    tracks: Array.from({ length: 2 }, (_, i) => ({
      ...baseTrack,
      ...overrides,
    }))

  })
};
