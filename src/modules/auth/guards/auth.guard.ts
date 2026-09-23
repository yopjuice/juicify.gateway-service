import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, OnModuleInit } from '@nestjs/common';
import { Metadata } from '@grpc/grpc-js';
import { AuthGrpc } from '../auth.client.js';
import { GrpcToPromise } from '../../../shared/types/index.js';
import { AuthServiceClient } from '@juice11-micro/contracts';
import { UserInfo } from '../types/index.js';
import { UnauthenticatedError } from '../../../shared/errors/domain-errors.js';


@Injectable()
export class AuthGuard implements CanActivate, OnModuleInit {
  private client: GrpcToPromise<AuthServiceClient>;

  constructor(
   private readonly wrapper: AuthGrpc,
  ) {}

  onModuleInit() {
    this.client = this.wrapper.client;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthenticatedError();
    }

    const metadata = new Metadata();
    metadata.add('authorization', authHeader); 

    try {
      const userPayload = await this.client.getMyInfo({}, metadata);

      const reqUser: UserInfo = {
        id: userPayload.id,
        email: userPayload.email,
        role: userPayload.role,
      };

      request.user = reqUser;
      
      return true;
    } catch (error) {
      throw new UnauthenticatedError();
    }
  }
}
