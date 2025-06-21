import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod/v4';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const CreateQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBody = z.infer<typeof CreateQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(CreateQuestionBodySchema))
    body: CreateQuestionBody,
  ) {
    const { title, content } = CreateQuestionBodySchema.parse(body);

    const question = await this.createQuestion.execute({
      title,
      content,
      authorId: user.sub,
      attachmentsIds: [],
    });

    return { question };
  }
}
