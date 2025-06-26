import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repsitory';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer);

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer) {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id);
    this.items[answerIndex] = answer;

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const answers = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20);

    return answers;
  }

  async delete(answer: Answer) {
    const answerIndex = this.items.findIndex((item) => item.id === answer.id);
    this.items.splice(answerIndex, 1);
    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toString(),
    );
  }
}
