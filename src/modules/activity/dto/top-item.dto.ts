import { IsEnum, IsNumber } from "class-validator";
import { ItemType } from "../types/index.js";
import { Type } from "class-transformer";

export class TopItemsDto {
  @IsEnum(ItemType)
  itemType: ItemType;

  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsNumber()
  @Type(() => Number)
  daysAgo: number;
}
