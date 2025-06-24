import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod/v4';
import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers';
import { AnswerPresenter } from '../presenters/answer-presenter';

const PageQueryParamSchema = z.coerce.number().min(1).default(1);

const QueryValidationPipe = new ZodValidationPipe(PageQueryParamSchema);

type PageQueryParam = z.infer<typeof PageQueryParamSchema>;

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private fetchQuestionAnswers: FetchQuestionAnswersUseCase) {}

  @Get()
  async handle(
    @Query('page', QueryValidationPipe) page: PageQueryParam,
    @Param('questionId') questionId: string,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      page,
      questionId,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const answers = result.value.answers;

    return { answers: answers.map(AnswerPresenter.toHTTP) };
  }
}
