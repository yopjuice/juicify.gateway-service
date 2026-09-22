import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { GrpcToPromise } from '../../shared/types/index.js';
import { TrackServiceClient } from '@juice11-micro/contracts';
import { CatalogGrpc } from './catalog.client.js';
import { CreateTrackDto } from './dto/create-track.dto.js';
import { UpdateTrackDto } from './dto/update-track.dto.js';

@Controller('/catalog/tracks')
export class TrackController {

  private client: GrpcToPromise<TrackServiceClient>

  constructor(
    private readonly wrapper: CatalogGrpc,
  ) { }

  onModuleInit() {
    this.client = this.wrapper.getClient('track');
  }

  @Get()
  async findAll() {
    return await this.client.listTracks({});
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.client.getTrack({ id });
  }

  @Post()
  async create(@Body() body: CreateTrackDto) {
    return await this.client.createTrack(body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateTrackDto) {
    return await this.client.updateTrack({ id, ...body });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.client.deleteTrack({ id });
    return { ok: true }
  }
}
