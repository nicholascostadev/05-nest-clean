import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod/v4';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question';

const EditQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
  attachments: z.array(z.uuid()).default([]),
});

type EditQuestionBody = z.infer<typeof EditQuestionBodySchema>;

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(EditQuestionBodySchema))
    body: EditQuestionBody,
    @Param('id')
    questionId: string,
  ) {
    const { title, content, attachments } = EditQuestionBodySchema.parse(body);

    const result = await this.editQuestion.execute({
      questionId,
      title,
      content,
      authorId: user.sub,
      attachmentsIds: attachments,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
