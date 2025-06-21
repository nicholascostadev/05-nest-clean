import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/not-allowed-error';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import type { AnswersRepository } from '../repositories/answers-repsitory';

interface DeleteAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundException | NotAllowedException,
  void
>;

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundException());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedException());
    }

    await this.answersRepository.delete(answer);

    return right(undefined);
  }
}
