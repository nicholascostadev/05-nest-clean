import { type Either, right } from '@/core/either';
import type { Answer } from '../../enterprise/entities/answer';
import { AnswersRepository } from '../repositories/answers-repsitory';
import { Injectable } from '@nestjs/common';

type FetchQuestionAnswersUseCaseRequest = {
  questionId: string;
  page: number;
};

type FetchQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[];
  }
>;

@Injectable()
export class FetchQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return right({
      answers,
    });
  }
}
