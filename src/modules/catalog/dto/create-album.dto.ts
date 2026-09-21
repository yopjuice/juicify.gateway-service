import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export const AlbumType = {
  LP: 'LP',
  EP: 'EP',
  Single: 'SINGLE',
} as const;

export type AlbumType = typeof AlbumType[keyof typeof AlbumType];

export class CreateAlbumDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  releaseDate?: Date;

  @IsString()
  @IsOptional()
  coverUrl?: string;
 
  @IsEnum(AlbumType)
  type: AlbumType;

  @IsString()
  @IsNotEmpty()
  artistId: string;
}

export type CreateAlbumInput = Omit<CreateAlbumDto, 'releaseDate'> & {
  releaseDate?: string;
};
