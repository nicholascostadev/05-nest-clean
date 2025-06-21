import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  UsePipes,
} from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { z } from 'zod/v4';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student';
import { StudentAlreadyExistsException } from '@/domain/forum/application/use-cases/exceptions/student-already-exists-exception';
import { Public } from '@/infra/auth/public';

const CreateAccountBodySchema = z.object({
  name: z.string(),
  email: z.email(),
  password: z.string(),
});

type CreateAccountBody = z.infer<typeof CreateAccountBodySchema>;

@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private registerStudent: RegisterStudentUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(CreateAccountBodySchema))
  async handle(@Body() body: CreateAccountBody) {
    const { name, email, password } = body;

    const result = await this.registerStudent.execute({
      name,
      email,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case StudentAlreadyExistsException:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
