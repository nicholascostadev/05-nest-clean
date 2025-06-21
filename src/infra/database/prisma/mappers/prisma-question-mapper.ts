import type { Prisma, Question as PrismaQuestion } from '@prisma/client';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityId(raw.authorId),
        title: raw.title,
        slug: Slug.create(raw.slug),
        content: raw.content,
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityId(raw.bestAnswerId)
          : null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    );
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      title: question.title,
      slug: question.slug.value,
      content: question.content,
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
