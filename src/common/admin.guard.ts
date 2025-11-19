import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
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
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    if (req.user?.admin) return true;
    throw new ForbiddenException('Accès refusé');
  }
}
