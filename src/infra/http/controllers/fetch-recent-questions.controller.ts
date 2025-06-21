import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod/v4';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions';
import { QuestionPresenter } from '../presenters/question-presenter';

const PageQueryParamSchema = z.coerce.number().min(1).default(1);

const QueryValidationPipe = new ZodValidationPipe(PageQueryParamSchema);

type PageQueryParam = z.infer<typeof PageQueryParamSchema>;

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private fetchRecentQuestions: FetchRecentQuestionsUseCase) {}

  @Get()
  async handle(@Query('page', QueryValidationPipe) page: PageQueryParam) {
    const result = await this.fetchRecentQuestions.execute({ page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
    const questions = result.value.questions;

    return { questions: questions.map(QuestionPresenter.toHTTP) };
  }
}
