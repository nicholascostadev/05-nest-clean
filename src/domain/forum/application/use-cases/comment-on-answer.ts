import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import { AnswersRepository } from '../repositories/answers-repsitory';
import { Injectable } from '@nestjs/common';

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundException,
  {
    answerComment: AnswerComment;
  }
>;

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundException());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
