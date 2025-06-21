import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  items: Question[] = [];

  constructor(
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async save(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    );

    this.items[questionIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    return question;
  }

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id);

    if (!question) {
      return null;
    }

    return question;
  }

  async findManyRecent(params: PaginationParams) {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((params.page - 1) * 20, params.page * 20);

    return questions;
  }

  async delete(question: Question) {
    const questionIndex = this.items.findIndex(
      (item) => item.id === question.id,
    );

    this.items.splice(questionIndex, 1);

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toString(),
    );
  }
}
