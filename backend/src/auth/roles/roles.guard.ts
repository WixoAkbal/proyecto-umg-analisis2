import { CanActivate, ExecutionContext, ForbiddenException, Injectable, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../auth.decorator';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly _reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this._reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // Si el endpoint no tiene @Roles(), cualquiera que
    // haya pasado el JwtGuard puede acceder los que tienen el decorador public.
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('Usuario no autenticado');
    }

    const userRoles = user.roles;

    const hasRole = requiredRoles.some((role) =>
      userRoles.includes(role),
    );

    if (!hasRole) {
      throw new ForbiddenException(
        'No tienes permisos para acceder a este recurso',
      );
    }

    return true;
  }
}
