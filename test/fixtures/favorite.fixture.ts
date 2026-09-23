import { ItemType } from "../../src/modules/activity/types/index.js";
import { GetFavoriteDto } from "../../src/modules/activity/dto/get-favs.dto.js";
import { CheckFavoriteDto } from "../../src/modules/activity/dto/check-favs.dto.js";
import { CheckFavoritesResponse, GetUserFavoritesResponse } from "@juice11-micro/contracts";

const baseFavorite = {
  userId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  itemType: ItemType.Track,
  itemId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
} as const;


export const FavoriteFixtures = {

  checkFavoriteDto: (overrides?: Partial<CheckFavoriteDto>): CheckFavoriteDto => ({
    userId: baseFavorite.userId,
    itemType: baseFavorite.itemType,
    itemIds: FavoriteFixtures.idsArray(),
    ...overrides,
  }),

  checkFavoriteResponse: (overrides?: Partial<CheckFavoritesResponse>): CheckFavoritesResponse => ({
    results: {
      '8440640d-daa7-4c12-acdc-ff432cd750d8': true,
      '290d522d-caff-4c4c-9a8d-714b2ed04775': false,
    },
    ...overrides,
  }),

  getUserFavoriteDto: (overrides?: Partial<GetFavoriteDto>): GetFavoriteDto => ({
    userId: baseFavorite.userId,
    itemType: 'TRACK',
    ...overrides,
  }),

  getUserFavoriteResponse: (overrides?: Partial<GetUserFavoritesResponse>): GetUserFavoritesResponse => ({
    itemIds: ['bde22aa4-fa99-4bf8-be65-fec82cdd85e2'],
    ...overrides,
  }),

  idsArray: (count = 2): string[] =>
    Array.from({ length: count }, (_, i) =>
      `5176cfd5-954f-46a1-bdb5-b4006a24ffc${i}`,
    ),

};
