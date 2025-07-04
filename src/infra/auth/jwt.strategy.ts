import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod/v4';
import { EnvService } from '../env/env.service';

const TokenPayloadSchema = z.object({
  sub: z.uuid(),
});

export type UserPayload = z.infer<typeof TokenPayloadSchema>;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(envService: EnvService) {
    const publicKey = envService.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  validate(payload: UserPayload) {
    return TokenPayloadSchema.parse(payload);
  }
}
