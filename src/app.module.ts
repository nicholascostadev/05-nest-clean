import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateAccountController } from './controllers/create-account.controller';
import { z } from 'zod/v4';
import { createErrorMap } from 'zod-validation-error/v4';
import { ConfigModule } from '@nestjs/config';
import { EnvSchema } from './env';
import { AuthModule } from './auth/auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { JwtStrategy } from './auth/jwt.strategy';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';

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
  ],
  controllers: [
    CreateAccountController,
    AuthenticateController,
    CreateQuestionController,
    FetchRecentQuestionsController,
  ],
  providers: [PrismaService, JwtStrategy],
})
export class AppModule {}
