import { Module } from '@nestjs/common';
import { z } from 'zod/v4';
import { createErrorMap } from 'zod-validation-error/v4';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { JwtStrategy } from './auth/jwt.strategy';
import { HttpModule } from './http/http.module';

z.config({
  customError: createErrorMap({
    includePath: true,
  }),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => EnvSchema.parse(env),
      isGlobal: true,
    }),
    AuthModule,
    HttpModule,
  ],
  providers: [JwtStrategy],
})
export class AppModule {}
