import { Controller, Get, Query  } from '@nestjs/common';
import { GrpcToPromise } from '../../shared/types/index.js';
import { GetUserActivityResponse, InteractionServiceClient } from '@juice11-micro/contracts';
import { ActivityGrpc } from './activity.client.js';
import { GetUserActivityDto } from './dto/get-activity.dto.js';
import { UseRoles } from '../auth/decorators/use-roles.decorator.js';

@Controller('/activity/interactions')
export class InteractionController {

  private client: GrpcToPromise<InteractionServiceClient>

  constructor(
    private readonly wrapper: ActivityGrpc,
  ) { }

  onModuleInit() {
    this.client = this.wrapper.getClient('interaction');
  }

  @UseRoles(['ADMIN'])
  @Get()
  async findByUser(@Query() data: GetUserActivityDto): Promise<GetUserActivityResponse> {
    const { logs } = await this.client.getUserActivity(data);
    return { logs };
  }

}
