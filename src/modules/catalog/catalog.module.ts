import { Module } from '@nestjs/common';
import { CatalogController } from './catalog.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service.js';
import { grpcPackages, grpcProtoPaths } from '../../infrastructure/grpc/gprc.options.js';
import { grpcClientInterceptor } from '../../infrastructure/grpc/grpc.client.interceptor.js';
import { CatalogGrpc } from './catalog.client.js';
import { TrackController } from './track.controller.js';
import { AlbumController } from './album.controller.js';
import { ArtistController } from './artist.controller.js';
import { GenreController } from './genre.controller.js';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'CATALOG_INTERNAL_PROXY',
        inject: [MyConfigService],
        useFactory: (config: MyConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('catalog.host')}:${config.get('catalog.port')}`,
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
    CatalogController,
    TrackController,
    AlbumController,
    ArtistController,
    GenreController,

  ],
  providers: [CatalogGrpc],
})
export class CatalogModule { }
