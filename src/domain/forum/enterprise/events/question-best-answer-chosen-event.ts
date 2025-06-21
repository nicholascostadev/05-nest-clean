import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';
import type { Question } from '../entities/question';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  ocurredAt: Date;
  question: Question;
  bestAnswerId: UniqueEntityId;

  constructor(question: Question, bestAnswerId: UniqueEntityId) {
    this.ocurredAt = new Date();
    this.question = question;
    this.bestAnswerId = bestAnswerId;
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id;
  }
}
