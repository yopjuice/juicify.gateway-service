import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateGenreDto } from './create-genre.dto.js';

export class UpdateGenreDto extends PartialType(CreateGenreDto) {}

export class UpdateGenrePayloadDto extends UpdateGenreDto {
  @IsUUID()
  id: string;
}
