import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Answer,
  type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer-mapper';

export function makeAnswer(
  override?: Partial<AnswerProps>,
  id?: UniqueEntityId,
) {
  const answer = Answer.create(
    {
      authorId: new UniqueEntityId('author-1'),
      questionId: new UniqueEntityId('question-1'),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}

@Injectable()
export class AnswerFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAnswer(data: Partial<AnswerProps> = {}): Promise<Answer> {
    const answer = makeAnswer(data);

    await this.prismaService.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    });

    return answer;
  }
}
