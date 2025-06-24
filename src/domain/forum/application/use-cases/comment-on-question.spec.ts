import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { CommentOnQuestionUseCase } from './comment-on-question';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: CommentOnQuestionUseCase;

describe('Comment on Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository();
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionCommentsRepository,
    );
  });

  it('should be able to comment on a question', async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      authorId: question.authorId.toString(),
      questionId: question.id.toString(),
      content: 'Test comment',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionCommentsRepository.items).toHaveLength(1);
    expect(inMemoryQuestionCommentsRepository.items[0]).toEqual(
      expect.objectContaining({
        content: 'Test comment',
      }),
    );
  });
});
