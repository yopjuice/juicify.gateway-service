import { IsUUID, IsNotEmpty, IsEnum } from 'class-validator';
import { ItemType } from '../types/index.js';

export class ItemLikeEventDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsEnum(ItemType)
  itemType: ItemType;

}
