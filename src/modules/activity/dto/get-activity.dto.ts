import { Type } from "class-transformer";
import { IsNotEmpty, IsNumber, IsUUID } from "class-validator";

export class GetUserActivityDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @Type(() => Number)
  limit: number;
}
