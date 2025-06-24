import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  QuestionComment,
  type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper';

export function makeQuestionComment(
  override?: Partial<QuestionCommentProps>,
  id?: UniqueEntityId,
) {
  const questionComment = QuestionComment.create(
    {
      content: faker.lorem.text(),
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaQuestionComment(
    data: Partial<QuestionCommentProps> = {},
  ): Promise<QuestionComment> {
    const questionComment = makeQuestionComment(data);

    await this.prismaService.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    });

    return questionComment;
  }
}
