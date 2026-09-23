import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MyConfigService } from '../../config/config.service.js';
import { grpcPackages, grpcProtoPaths } from '../../infrastructure/grpc/gprc.options.js';
import { grpcClientInterceptor } from '../../infrastructure/grpc/grpc.client.interceptor.js';
import { AuthGrpc } from './auth.client.js';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_INTERNAL_PROXY',
        inject: [MyConfigService],
        useFactory: (config: MyConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: `${config.get('auth.host')}:${config.get('auth.port')}`,
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
  controllers: [AuthController],
  providers: [AuthGrpc],
  exports: [AuthGrpc],
})
export class AuthModule { }
