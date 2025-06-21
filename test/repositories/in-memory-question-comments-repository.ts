import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments-repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  items: QuestionComment[] = [];

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async findById(id: string) {
    const questionComment = this.items.find(
      (item) => item.id.toString() === id,
    );

    return questionComment ?? null;
  }

  async findManyByQuestionId(questionId: string, params: PaginationParams) {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((params.page - 1) * 20, params.page * 20);

    return questionComments;
  }

  async delete(questionComment: QuestionComment) {
    const questionCommentIndex = this.items.findIndex(
      (item) => item.id === questionComment.id,
    );

    this.items.splice(questionCommentIndex, 1);
  }
}
