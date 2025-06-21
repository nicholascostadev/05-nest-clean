import { makeAnswer } from 'test/factories/make-answer';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository';
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository';
import { FetchQuestionAnswersUseCase } from './fetch-question-answers';

let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );
    sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository);
  });

  it('should be able to fetch question answers', async () => {
    const question = makeQuestion();
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
        createdAt: new Date(2022, 0, 20),
      }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
        createdAt: new Date(2022, 0, 18),
      }),
    );
    await inMemoryAnswersRepository.create(
      makeAnswer({
        questionId: question.id,
        createdAt: new Date(2022, 0, 23),
      }),
    );

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(3);
  });

  it('should be able to fetch paginated question answers', async () => {
    const question = makeQuestion();
    for (let i = 0; i < 22; i++) {
      await inMemoryAnswersRepository.create(
        makeAnswer({
          questionId: question.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.answers).toHaveLength(2);
  });
});
