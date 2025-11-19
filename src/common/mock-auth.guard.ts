import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

interface AuthenticatedUser {
  id: number;
  username: string;
  admin: boolean;
}

interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

@Injectable()
export class MockAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    req.user = { id: 1, username: 'demo', admin: true };
    return true;
  }
}
