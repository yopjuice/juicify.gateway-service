import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateArtistDto } from './create-artist.dto.js';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}

export class UpdateArtistPayloadDto extends UpdateArtistDto {
  @IsUUID()
  id: string;
}
