import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository';
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  items: QuestionAttachment[] = [];

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    return this.items.filter(
      (item) => item.questionId.toString() === questionId,
    );
  }

  async createMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: QuestionAttachment[]): Promise<void> {
    this.items = this.items.filter(
      (item) => !attachments.some((attachment) => attachment.equals(item)),
    );
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.items = this.items.filter(
      (item) => item.questionId.toString() !== questionId,
    );
  }
}
