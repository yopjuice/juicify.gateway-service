import { GetTopItemsResponse } from "@juice11-micro/contracts";
import { TopItemsDto } from "../../src/modules/activity/dto/top-item.dto.js";
import { ItemType } from "../../src/modules/activity/types/index.js";

const baseStats = {
  id: '8205e4b3-0be8-42d6-a4b3-ebbd887c5c34',
  itemId: '28bba6df-e10d-4018-93ea-f5b03dccb0de',
  score: 10,
} as const;




export const StatsFixtures = {
  // Get valid UUID
  uuid: (): string => baseStats.id,

  getTopItemsDto: (overrides?: Partial<TopItemsDto>): TopItemsDto => ({
    itemType: ItemType.Track,
    limit: 10,
    daysAgo: 7,
    ...overrides,
  }),

  getTopItemsResponse: (overrides?: Partial<GetTopItemsResponse>): GetTopItemsResponse => ({
    items: Array.from({ length: 2 }, (_, i) => ({
      ...baseStats,
      ...overrides,
    }))
  })

};
