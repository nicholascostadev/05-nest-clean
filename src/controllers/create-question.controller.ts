import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor() {}

  @Post()
  handle(@CurrentUser() user: UserPayload) {
    return {
      user,
    };
  }
}
