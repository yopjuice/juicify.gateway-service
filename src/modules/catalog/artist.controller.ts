import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GrpcToPromise } from '../../shared/types/index.js';
import { ArtistServiceClient } from '@juice11-micro/contracts';
import { CatalogGrpc } from './catalog.client.js';
import { CreateArtistDto } from './dto/create-artist.dto.js';
import { UpdateArtistDto } from './dto/update-artist.dto.js';

@Controller('/catalog/artists')
export class ArtistController {

  private client: GrpcToPromise<ArtistServiceClient>

  constructor(
    private readonly wrapper: CatalogGrpc,
  ) { }

  onModuleInit() {
    this.client = this.wrapper.getClient('artist');
  }

  @Get()
  async findAll() {
    return await this.client.listArtists({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.client.getArtist({ id });
  }

  @Post()
  async create(@Body() body: CreateArtistDto) {
    return await this.client.createArtist(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateArtistDto) {
    return await this.client.updateArtist({ id, ...body });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.client.deleteArtist({ id });
    return { ok: true }
  }
}
