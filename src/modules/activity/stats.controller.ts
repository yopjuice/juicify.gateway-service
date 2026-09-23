import { Controller, Get, Query } from '@nestjs/common';
import { GrpcToPromise } from '../../shared/types/index.js';
import { GetTopItemsResponse, StatsServiceClient } from '@juice11-micro/contracts';
import { ActivityGrpc } from './activity.client.js';
import { TopItemsDto } from './dto/top-item.dto.js';

@Controller('/activity/stats')
export class StatsController {

  private client: GrpcToPromise<StatsServiceClient>

  constructor(
    private readonly wrapper: ActivityGrpc,
  ) { }

  onModuleInit() {
    this.client = this.wrapper.getClient('stats');
  }

  @Get()
  async getTopItems(@Query() data: TopItemsDto): Promise<GetTopItemsResponse> {
    const { items } = await this.client.getTopItems(data);

    return { items };
  }

}
