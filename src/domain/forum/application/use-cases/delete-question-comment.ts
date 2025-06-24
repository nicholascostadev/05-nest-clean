import { type Either, left, right } from '@/core/either';
import { NotAllowedException } from '@/core/exceptions/not-allowed-error';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import { Injectable } from '@nestjs/common';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<
  ResourceNotFoundException | NotAllowedException,
  void
>;

@Injectable()
export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment =
      await this.questionCommentsRepository.findById(questionCommentId);

    if (!questionComment) {
      return left(new ResourceNotFoundException());
    }

    if (questionComment.authorId.toString() !== authorId) {
      return left(new NotAllowedException());
    }

    await this.questionCommentsRepository.delete(questionComment);

    return right(undefined);
  }
}
