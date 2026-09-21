import { IsNumber, IsString } from 'class-validator';

export class AuthValidator {
  @IsString()
  AUTH_HOST: string;

  @IsNumber()
  AUTH_PORT: number;
}
