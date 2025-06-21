import { makeAnswer } from 'test/factories/make-answer';
import { makeAnswerComment } from 'test/factories/make-answer-comment';
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answer-comments-repository';
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch answer comments', async () => {
    const answer = makeAnswer();
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        createdAt: new Date(2022, 0, 20),
      }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        createdAt: new Date(2022, 0, 18),
      }),
    );
    await inMemoryAnswerCommentsRepository.create(
      makeAnswerComment({
        answerId: answer.id,
        createdAt: new Date(2022, 0, 23),
      }),
    );

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(3);
  });

  it('should be able to fetch paginated answer comments', async () => {
    const answer = makeAnswer();
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: answer.id,
        }),
      );
    }

    const result = await sut.execute({
      answerId: answer.id.toString(),
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answerComments).toHaveLength(2);
  });
});
