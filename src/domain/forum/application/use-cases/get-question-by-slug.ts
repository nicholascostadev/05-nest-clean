import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import type { Question } from '../../enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions-repository';

type GetQuestionBySlugUseCaseRequest = {
  slug: string;
};

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundException,
  {
    question: Question;
  }
>;

export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundException());
    }

    return right({
      question,
    });
  }
}
