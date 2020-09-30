import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

const adminKey = process.env.X_ADMIN_KEY;

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();
    return (request.headers[`x-admin-key`] === adminKey);
  }
}
