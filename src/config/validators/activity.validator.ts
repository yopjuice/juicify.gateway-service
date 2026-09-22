import { IsNumber, IsString } from 'class-validator';

export class ActivityValidator {
  @IsString()
  ACTIVITY_HOST: string;

  @IsNumber()
  ACTIVITY_PORT: number;
}
