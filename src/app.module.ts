import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { z } from 'zod/v4';
import { createErrorMap } from 'zod-validation-error/v4';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './env';

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
  ],
  controllers: [CreateAccountController],
  providers: [PrismaService],
})
export class AppModule {}
