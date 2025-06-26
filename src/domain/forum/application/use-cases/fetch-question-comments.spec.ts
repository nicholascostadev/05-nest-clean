import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionComment } from 'test/factories/make-question-comment';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { FetchQuestionCommentsUseCase } from './fetch-question-comments';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { makeStudent } from 'test/factories/make-student';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );
    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });

    inMemoryStudentsRepository.items.push(student);
    const question = makeQuestion();

    const comment1 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    });
    const comment2 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    });
    const comment3 = makeQuestionComment({
      questionId: question.id,
      authorId: student.id,
    });

    await inMemoryQuestionCommentsRepository.create(comment1);
    await inMemoryQuestionCommentsRepository.create(comment2);
    await inMemoryQuestionCommentsRepository.create(comment3);

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(3);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          commentId: comment1.id,
          author: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment2.id,
          author: 'John Doe',
        }),
        expect.objectContaining({
          commentId: comment3.id,
          author: 'John Doe',
        }),
      ]),
    );
  });

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });
    inMemoryStudentsRepository.items.push(student);

    const question = makeQuestion();
    for (let i = 0; i < 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          questionId: question.id,
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      questionId: question.id.toString(),
      page: 2,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });
});
