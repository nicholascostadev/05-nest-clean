import { type Either, left, right } from '@/core/either';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import { QuestionsRepository } from '../repositories/questions-repository';
import { Injectable } from '@nestjs/common';
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details';

type GetQuestionBySlugUseCaseRequest = {
  slug: string;
};

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundException,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findBySlugWithDetails(slug);

    if (!question) {
      return left(new ResourceNotFoundException());
    }

    return right({
      question,
    });
  }
}
