import { AlbumServiceClient, ArtistServiceClient, AuthServiceClient, CatalogServiceClient, GenreServiceClient, TrackServiceClient } from "@juice11-micro/contracts";
import { createClientMock } from "../../src/shared/utils/client.mock.js";

export const authGrpcMock = createClientMock<AuthServiceClient>([
    'register',
    'login',
    'refreshTokens',
    'logout',
    'getMyInfo',
]);

export const catalogGrpcMock = createClientMock<CatalogServiceClient>([
  'ping',
]);

export const artistGrpcMock = createClientMock<ArtistServiceClient>([
  'getArtist',
  'listArtists',
  'createArtist',
  'updateArtist',
  'deleteArtist',
]);

export const albumGrpcMock = createClientMock<AlbumServiceClient>([
  'createAlbum',
  'getAlbum',
  'listAlbums',
  'updateAlbum',
  'deleteAlbum',
]);

export const trackGrpcMock = createClientMock<TrackServiceClient>([
  'createTrack',
  'getTrack',
  'listTracks',
  'updateTrack',
  'deleteTrack',
]);

export const genreGrpcMock = createClientMock<GenreServiceClient>([
  'createGenre',
  'getGenre',
  'listGenres',
  'updateGenre',
  'deleteGenre',
])
