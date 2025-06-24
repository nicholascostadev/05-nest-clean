import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod/v4';
import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments';
import { CommentPresenter } from '../presenters/comment-presenter';

const PageQueryParamSchema = z.coerce.number().min(1).default(1);

const QueryValidationPipe = new ZodValidationPipe(PageQueryParamSchema);

type PageQueryParam = z.infer<typeof PageQueryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private fetchAnswerComments: FetchAnswerCommentsUseCase) {}

  @Get()
  async handle(
    @Query('page', QueryValidationPipe) page: PageQueryParam,
    @Param('answerId') answerId: string,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const answerComments = result.value.answerComments;

    return {
      answerComments: answerComments.map(CommentPresenter.toHTTP),
    };
  }
}
