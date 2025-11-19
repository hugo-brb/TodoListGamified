import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Types } from 'mongoose';

export interface JwtPayload {
  sub: string; // userId
  email: string;
  username: string;
  admin?: boolean;
}

export interface AuthenticatedUser {
  userId: Types.ObjectId;
  email: string;
  username: string;
  admin: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    });
  }

  async validate(payload: JwtPayload): Promise<AuthenticatedUser> {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('Utilisateur invalide');
    }

    return {
      userId: user._id,
      email: user.email,
      username: user.username,
      admin: payload.admin || false,
    };
  }
}
