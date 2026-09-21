import { BadRequestException, Body, Controller, Get, OnModuleInit, Param, Post, Req, Res } from '@nestjs/common';
import { CatalogGrpc, EntityType } from './catalog.client.js';
import type { GrpcToPromise } from '../../shared/types/index.js';
import { CatalogServiceClient, PingResponse, } from '@juice11-micro/contracts';
import { MyConfigService } from '../../config/config.service.js';


@Controller('catalog')
export class CatalogController implements OnModuleInit {
  private client: GrpcToPromise<CatalogServiceClient>

  private readonly validEntities: EntityType[] = ['track', 'album', 'artist', 'genre'];

  constructor(
    private readonly wrapper: CatalogGrpc,
    private readonly config: MyConfigService,
  ) { }

  onModuleInit() {
    this.client = this.wrapper.getClient('catalog');
  }


  @Get('ping')
  async register(): Promise<PingResponse> {
    return this.client.ping({});
  }

  @Get(':entity')
  async findAll(
    @Param('entity') entity: string,
  ) {
    this.validateEntity(entity);

    const client = this.wrapper.getClient(entity as Exclude<EntityType, 'catalog'>);

    const capitalized = entity.charAt(0).toUpperCase() + entity.slice(1);
    const methodName = `get${capitalized}s`;

    return await client[methodName]({});
  }

  @Get(':entity/:id')
  async findOne(
    @Param('entity') entity: string,
    @Param('id') id: string,
  ) {
    this.validateEntity(entity);

    const client = this.wrapper.getClient(entity as Exclude<EntityType, 'catalog'>);

    const capitalized = entity.charAt(0).toUpperCase() + entity.slice(1);
    const methodName = `get${capitalized}`;

    return await client[methodName]({ id });
  }

  private validateEntity(entity: string) {
    const isExist = this.validEntities.includes(entity.toLowerCase() as EntityType);
    if (!isExist) {
      throw new BadRequestException(
        `Invalid catalog type "${entity}". Choose from: ${this.validEntities.join(', ')}`
      );
    }
  }

}
