import { FavoritesServiceClient, InteractionServiceClient, StatsServiceClient } from '@juice11-micro/contracts';
import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import type { ClientGrpc } from '@nestjs/microservices';
import { lastValueFrom, Observable } from 'rxjs';
import { GrpcToPromise } from '../../shared/types/index.js';

export type EntityType = 'favorite' | 'interaction' | 'stats';

export interface RawServices {
  favorite: FavoritesServiceClient,
  interaction: InteractionServiceClient,
  stats: StatsServiceClient,
}

@Injectable()
export class ActivityGrpc implements OnModuleInit {
  private readonly logger = new Logger(ActivityGrpc.name);
  private rawServices: RawServices = {} as RawServices;

  constructor(
    @Inject('ACTIVITY_INTERNAL_PROXY') private readonly grpcClient: ClientGrpc,
  ) {}

  onModuleInit() {
    // Original gRPC service from Nest
    this.rawServices.favorite = this.grpcClient.getService<FavoritesServiceClient>('FavoriteService');
    this.rawServices.interaction = this.grpcClient.getService<InteractionServiceClient>('InteractionService');
    this.rawServices.stats = this.grpcClient.getService<StatsServiceClient>('StatsService');
  }

  getClient<T extends EntityType>(entity: T): GrpcToPromise<RawServices[T]> {

    const service = this.rawServices[entity];

    // Create proxy, which will call original methods
    return new Proxy(service, {
      get: (target, propKey, receiver) => {
        // check if method exists in original service
        if (typeof target[propKey] === 'function') {
          return async (...args: any[]) => {
            const methodName = String(propKey);
            this.logger.log(`[gRPC Outgoing] Call: ${methodName}`, { args });

            try {
              // Call original method
              const result = target[propKey].apply(target, args);

              // If it's Observable (standard for NestJS gRPC), wrap in Promise
              if (result instanceof Observable) {
                return await lastValueFrom(result);
              }

              return result;
            } catch (error: any) {
              this.logger.error(`[gRPC Outgoing Error] ${methodName} failed: ${error.message}`);
              throw error;
            }
          };
        }

        return Reflect.get(target, propKey, receiver);
      },
    }) as any;
    
  }
}
