import { Strategy, ExtractJwt } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_REFRESH_SECRET!,
      passReqToCallback: true as const,
      ignoreExpiration: false,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const authHeader = req.get('authorization') ?? '';
    const refreshToken = authHeader.replace('Bearer', '').trim();

    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      refreshToken,
    };
  }
}
