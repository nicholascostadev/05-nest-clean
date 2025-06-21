import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { z } from 'zod/v4';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { compare } from 'bcryptjs';

const AuthenticateBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof AuthenticateBodySchema>;

const BodyValidationPipe = new ZodValidationPipe(AuthenticateBodySchema);

@Controller('/sessions')
export class AuthenticateController {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handle(@Body(BodyValidationPipe) body: AuthenticateBody) {
    const { email, password } = body;

    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password incorrect');
    }

    const accessToken = this.jwtService.sign({ sub: user.id });

    return {
      access_token: accessToken,
    };
  }
}
