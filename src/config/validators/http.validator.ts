import { IsNumber, IsString } from 'class-validator';

export class HttpValidator {
  @IsString()
  HTTP_HOST: string;

  @IsNumber()
  HTTP_PORT: number;
}
