import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';
import type { AnswerComment } from '../entities/answer-comment';

export class AnswerCommentCreatedEvent implements DomainEvent {
  ocurredAt: Date;
  answerComment: AnswerComment;

  constructor(answerComment: AnswerComment) {
    this.ocurredAt = new Date();
    this.answerComment = answerComment;
  }

  getAggregateId(): UniqueEntityId {
    return this.answerComment.id;
  }
}
