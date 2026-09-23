import { GetUserActivityResponse } from "@juice11-micro/contracts";
import { ActionType, ItemType } from "../../src/modules/activity/types/index.js";
import { GetUserActivityDto } from "../../src/modules/activity/dto/get-activity.dto.js";

const baseInteraction = {
  id: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  userId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  itemType: ItemType.Track,
  itemId: '5176cfd5-954f-46a1-bdb5-b4006a24ffcd',
  actionType: ActionType.Like,
  weight: 5,
  createdAt: new Date('1970-01-01T00:00:00.000Z'),
} as const;

export const InteractionFixtures = {

  getUserActivityDto: (overrides?: Partial<GetUserActivityDto>): GetUserActivityDto => ({
    userId: baseInteraction.userId,
    limit: 5,
    ...overrides,
  }),

  getUserActivityResponse: (overrides?: Partial<GetUserActivityResponse>): GetUserActivityResponse => ({
    logs: Array.from({ length: 2 }, (_, i) => ({
      ...baseInteraction,
      ...overrides,
    }))
  })

};
