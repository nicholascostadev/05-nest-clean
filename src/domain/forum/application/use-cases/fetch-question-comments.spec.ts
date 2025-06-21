import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question comments', async () => {
    const question = makeQuestion();
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
        createdAt: new Date(2022, 0, 20),
      }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
        createdAt: new Date(2022, 0, 18),
      }),
    );
    await inMemoryQuestionCommentsRepository.create(
      makeQuestionComment({
        questionId: question.id,
        createdAt: new Date(2022, 0, 23),
      }),
    );

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionComments).toHaveLength(3);
  });

  it('should be able to fetch paginated question comments', async () => {
    const question = makeQuestion();
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.questionComments).toHaveLength(2);
  });
});
