import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod/v4';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question';

const CreateQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.uuid()).default([]),
});

type CreateQuestionBody = z.infer<typeof CreateQuestionBodySchema>;

@Controller('/questions')
export class CreateQuestionController {
  constructor(private createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(CreateQuestionBodySchema))
    body: CreateQuestionBody,
  ) {
    const { title, content } = CreateQuestionBodySchema.parse(body);

    const result = await this.createQuestion.execute({
      title,
      content,
      authorId: user.sub,
      attachmentsIds: body.attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
