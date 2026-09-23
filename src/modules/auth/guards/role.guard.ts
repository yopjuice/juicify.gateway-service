import { Reflector } from '@nestjs/core';
import { PermissionDeniedError } from '../../../shared/errors/domain-errors.js';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    
    const hasRole = requiredRoles.includes(user?.role);
    if (!hasRole) {
      throw new PermissionDeniedError();
    }

    return true;
  }
}
