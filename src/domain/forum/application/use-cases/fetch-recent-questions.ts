import { type Either, right } from '@/core/either';
import type { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Injectable } from '@nestjs/common';

type FetchRecentQuestionsUseCaseRequest = {
  page: number;
};

type FetchRecentQuestionsUseCaseResponse = Either<
  null,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({
      page,
    });

    return right({
      questions,
    });
  }
}
