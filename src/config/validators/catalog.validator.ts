import { IsNumber, IsString } from 'class-validator';

export class CatalogValidator {
  @IsString()
  CATALOG_HOST: string;

  @IsNumber()
  CATALOG_PORT: number;
}
