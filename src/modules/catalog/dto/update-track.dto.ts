import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreateTrackDto } from './create-track.dto.js';

export class UpdateTrackDto extends PartialType(CreateTrackDto) {}

export class UpdateTrackPayloadDto extends UpdateTrackDto {
  @IsUUID()
  id: string;
}
