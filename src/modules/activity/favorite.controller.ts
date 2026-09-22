import { GrpcToPromise } from '../../shared/types/index.js';
import { CheckFavoritesResponse, FavoritesServiceClient, GetUserFavoritesResponse } from '@juice11-micro/contracts';
import { ActivityGrpc } from './activity.client.js';
import { Controller, Get } from '@nestjs/common';
import { CheckFavoriteDto } from './dto/check-favs.dto.js';
import { GetFavoriteDto } from './dto/get-favs.dto.js';

@Controller('/catalog/favorites')
export class FavoriteController {

  private client: GrpcToPromise<FavoritesServiceClient>

  constructor(
    private readonly wrapper: ActivityGrpc,
  ) { }

  onModuleInit() {
    this.client = this.wrapper.getClient('favorite');
  }

  @Get()
  async checkFavorite(data: CheckFavoriteDto): Promise<CheckFavoritesResponse> {
    const { results } = await this.client.checkFavorites(data);
    return { results };
  }

  @Get()
  async getUserFavorite(data: GetFavoriteDto): Promise<GetUserFavoritesResponse> {
    const { itemIds } = await this.client.getUserFavorites(data);
    return { itemIds };
  }

}
