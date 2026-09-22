import { IsEnum, IsUUID } from "class-validator";
import { ItemType } from "../types/index.js";

export class GetFavoriteDto {

  @IsUUID()
  userId: string;

  @IsEnum(ItemType)
  itemType: ItemType;
}
