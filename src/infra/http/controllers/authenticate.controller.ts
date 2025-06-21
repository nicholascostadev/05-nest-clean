import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { z } from 'zod/v4';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student';
import { WrongCredentialsException } from '@/domain/forum/application/use-cases/exceptions/wrong-credentials-exception';
import { Public } from '@/infra/auth/public';

const AuthenticateBodySchema = z.object({
  email: z.string(),
  password: z.string(),
});

type AuthenticateBody = z.infer<typeof AuthenticateBodySchema>;

const BodyValidationPipe = new ZodValidationPipe(AuthenticateBodySchema);

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateStudent: AuthenticateStudentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handle(@Body(BodyValidationPipe) body: AuthenticateBody) {
    const { email, password } = body;

    const result = await this.authenticateStudent.execute({
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsException:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
