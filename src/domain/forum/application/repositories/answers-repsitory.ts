import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { Answer } from '../../enterprise/entities/answer';

export interface AnswersRepository {
  findById(id: string): Promise<Answer | null>;
  findManyByQuestionId(
    questionId: string,
    params: PaginationParams,
  ): Promise<Answer[]>;
  delete(answer: Answer): Promise<void>;
  create(answer: Answer): Promise<void>;
  save(answer: Answer): Promise<void>;
}
