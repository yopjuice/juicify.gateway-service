import { GrpcToPromise } from '../../shared/types/index.js';
import { CheckFavoritesResponse, FavoritesServiceClient, GetUserFavoritesResponse } from '@juice11-micro/contracts';
import { ActivityGrpc } from './activity.client.js';
import { Controller, Get, Query } from '@nestjs/common';
import { CheckFavoriteDto } from './dto/check-favs.dto.js';
import { GetFavoriteDto } from './dto/get-favs.dto.js';
import { Auth } from '../auth/decorators/auth.decorator.js';

@Controller('/activity/favorites')
export class FavoriteController {

  private client: GrpcToPromise<FavoritesServiceClient>

  constructor(
    private readonly wrapper: ActivityGrpc,
  ) { }

  onModuleInit() {
    this.client = this.wrapper.getClient('favorite');
  }

  @Get('check')
  async checkFavorite(@Query() data: CheckFavoriteDto): Promise<CheckFavoritesResponse> {
    const { results } = await this.client.checkFavorites(data);
    return { results };
  }

  @Auth()
  @Get()
  async getUserFavorite(@Query() data: GetFavoriteDto): Promise<GetUserFavoritesResponse> {
    const { itemIds } = await this.client.getUserFavorites(data);
    return { itemIds };
  }

}
