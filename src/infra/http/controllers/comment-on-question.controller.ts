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
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question';

const CommentOnQuestionBodySchema = z.object({
  content: z.string(),
});

type CommentOnQuestionBody = z.infer<typeof CommentOnQuestionBodySchema>;

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(CommentOnQuestionBodySchema))
    body: CommentOnQuestionBody,
    @Param('questionId') questionId: string,
  ) {
    const { content } = CommentOnQuestionBodySchema.parse(body);

    const result = await this.commentOnQuestion.execute({
      questionId,
      content,
      authorId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
