import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service.js';
import { grpcPackages, grpcProtoPaths } from '../../infrastructure/grpc/gprc.options.js';
import { grpcClientInterceptor } from '../../infrastructure/grpc/grpc.client.interceptor.js';
import { InteractionController } from './interaction.controller.js';
import { FavoriteController } from './favorite.controller.js';
import { StatsController } from './stats.controller.js';
import { ActivityGrpc } from './activity.client.js';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ACTIVITY_INTERNAL_PROXY',
        inject: [MyConfigService],
        useFactory: (config: MyConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('activity.host')}:${config.get('activity.port')}`,
            package: grpcPackages,
            protoPath: grpcProtoPaths,
            channelOptions: {
              interceptors: [grpcClientInterceptor],
            },
          },
        }),
      },
    ]),
  ],
  controllers: [
    InteractionController,
    FavoriteController,
    StatsController,

  ],
  providers: [ActivityGrpc],
})
export class ActivityModule { }
