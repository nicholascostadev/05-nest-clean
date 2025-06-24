import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod/v4';
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question';

const AnswerQuestionBodySchema = z.object({
  content: z.string(),
});

type AnswerQuestionBody = z.infer<typeof AnswerQuestionBodySchema>;

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private answerQuestion: AnswerQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(AnswerQuestionBodySchema))
    body: AnswerQuestionBody,
    @Param('questionId') questionId: string,
  ) {
    const { content } = AnswerQuestionBodySchema.parse(body);

    const result = await this.answerQuestion.execute({
      questionId,
      content,
      authorId: user.sub,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
