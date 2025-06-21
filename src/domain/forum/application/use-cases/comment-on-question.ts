import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import { QuestionComment } from '../../enterprise/entities/question-comment';
import type { QuestionCommentsRepository } from '../repositories/question-comments-repository';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface CommentOnQuestionCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionCaseResponse = Either<
  ResourceNotFoundException,
  {
    questionComment: QuestionComment;
  }
>;

export class CommentOnQuestionCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CommentOnQuestionCaseRequest): Promise<CommentOnQuestionCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundException());
    }

    const questionComment = QuestionComment.create({
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
      content,
    });

    await this.questionCommentsRepository.create(questionComment);

    return right({
      questionComment,
    });
  }
}
