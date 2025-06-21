import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  items: AnswerComment[] = [];

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);

    DomainEvents.dispatchEventsForAggregate(answerComment.id);
  }

  async findById(id: string) {
    const answerComment = this.items.find((item) => item.id.toString() === id);

    return answerComment ?? null;
  }

  async delete(answerComment: AnswerComment) {
    const answerCommentIndex = this.items.findIndex(
      (item) => item.id === answerComment.id,
    );

    this.items.splice(answerCommentIndex, 1);
  }

  async findManyByAnswerId(answerId: string, params: PaginationParams) {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((params.page - 1) * 20, params.page * 20);

    return answerComments;
  }
}
