import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GrpcToPromise } from '../../shared/types/index.js';
import { GenreServiceClient } from '@juice11-micro/contracts';
import { CatalogGrpc } from './catalog.client.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Controller('/catalog/genres')
export class GenreController {

  private client: GrpcToPromise<GenreServiceClient>

  constructor(
    private readonly wrapper: CatalogGrpc,
  ) { }

  onModuleInit() {
    this.client = this.wrapper.getClient('genre');
  }

  @Get()
  async findAll() {
    return await this.client.listGenres({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.client.getGenre({ id });
  }

  @Post()
  async create(@Body() body: CreateGenreDto) {
    return await this.client.createGenre(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateGenreDto) {
    return await this.client.updateGenre({ id, ...body });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.client.deleteGenre({ id });
    return { ok: true }
  }
}
