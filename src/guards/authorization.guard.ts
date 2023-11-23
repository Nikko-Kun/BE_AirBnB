import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs'
import { Role } from '../user/entities/role.enum';

@Injectable()
export class AuthorizationGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
            context.getHandler(),
            context.getClass(),
        ]);
        


        
        if (!requiredRoles) {
            return true;
        }


        const request = context.switchToHttp().getRequest();
        const userRole = request.user.data
        
        return requiredRoles.includes(userRole.vai_tro_id);
    }
}