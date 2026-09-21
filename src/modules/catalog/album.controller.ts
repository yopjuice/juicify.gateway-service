import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GrpcToPromise } from '../../shared/types/index.js';
import { AlbumServiceClient } from '@juice11-micro/contracts';
import { CatalogGrpc } from './catalog.client.js';
import type {CreateAlbumInput} from './dto/create-album.dto.js';
import { UpdateAlbumDto } from './dto/update-album.dto.js';

@Controller('/catalog/albums')
export class AlbumController {

  private client: GrpcToPromise<AlbumServiceClient>

	constructor(
    private readonly wrapper: CatalogGrpc,
	) {}

  onModuleInit() {
    this.client = this.wrapper.getClient('album');
  }

  @Get()
  async findAll() {
    return await this.client.listAlbums({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.client.getAlbum({ id });
  }

  @Post()
  async create(@Body() body: CreateAlbumInput) {
    return await this.client.createAlbum(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateAlbumDto) {
    return await this.client.updateAlbum({ id, ...body });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.client.deleteAlbum({ id });
  }
}
