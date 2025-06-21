import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import { AnswerComment } from '../../enterprise/entities/answer-comment';
import type { AnswerCommentsRepository } from '../repositories/answer-comments-repository';
import type { AnswersRepository } from '../repositories/answers-repsitory';

interface CommentOnAnswerCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerCaseResponse = Either<
  ResourceNotFoundException,
  {
    answerComment: AnswerComment;
  }
>;

export class CommentOnAnswerCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
  }: CommentOnAnswerCaseRequest): Promise<CommentOnAnswerCaseResponse> {
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
