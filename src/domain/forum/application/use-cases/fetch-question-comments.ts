import { type Either, right } from '@/core/either';
import type { QuestionComment } from '../../enterprise/entities/question-comment';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';

type FetchQuestionCommentsUseCaseRequest = {
  questionId: string;
  page: number;
};

type FetchQuestionCommentsUseCaseResponse = Either<
  null,
  {
    questionComments: QuestionComment[];
  }
>;

export class FetchQuestionCommentsUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({
      questionComments,
    });
  }
}
