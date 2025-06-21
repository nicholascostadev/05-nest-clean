import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Answer,
  type AnswerProps,
} from '@/domain/forum/enterprise/entities/answer';

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
