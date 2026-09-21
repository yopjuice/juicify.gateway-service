import { PartialType } from "@nestjs/mapped-types";
import { IsUUID } from "class-validator";
import { CreateAlbumDto, CreateAlbumInput } from "./create-album.dto.js";

export class UpdateAlbumDto extends PartialType(CreateAlbumDto) {}

export class UpdateAlbumPayloadDto extends UpdateAlbumDto {
  @IsUUID()
  id: string;
}


export type UpdateAlbumInput = Partial<CreateAlbumInput>;
