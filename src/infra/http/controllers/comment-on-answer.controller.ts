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
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer';

const CommentOnAnswerBodySchema = z.object({
  content: z.string(),
});

type CommentOnAnswerBody = z.infer<typeof CommentOnAnswerBodySchema>;

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(CommentOnAnswerBodySchema))
    body: CommentOnAnswerBody,
    @Param('answerId') answerId: string,
  ) {
    const { content } = CommentOnAnswerBodySchema.parse(body);

    const result = await this.commentOnAnswer.execute({
      answerId,
      content,
      authorId: user.sub,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
