import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

interface IJwtStrategyPayload {
  sub: number | string;
  username: string;
}

interface IJwtStrategyPayloadResponse {
  id: number | string;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'jwt_secret',
    });
  }

  async validate(
    payload: IJwtStrategyPayload,
  ): Promise<IJwtStrategyPayloadResponse> {
    return { id: payload.sub, username: payload.username };
  }
}
