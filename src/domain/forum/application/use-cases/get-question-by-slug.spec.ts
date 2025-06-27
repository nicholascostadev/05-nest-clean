import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { GetQuestionBySlugUseCase } from './get-question-by-slug';
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository';
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository';
import { makeStudent } from 'test/factories/make-student';
import { makeAttachment } from 'test/factories/make-attachment';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryStudentsRepository = new InMemoryStudentsRepository();
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
      inMemoryAttachmentsRepository,
    );
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const student = makeStudent({
      name: 'John Doe',
    });
    inMemoryStudentsRepository.items.push(student);

    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
      authorId: student.id,
    });

    inMemoryQuestionsRepository.items.push(newQuestion);

    const attachment = makeAttachment({
      title: 'Example attachment',
    });
    inMemoryAttachmentsRepository.items.push(attachment);

    const questionAttachment = makeQuestionAttachment({
      questionId: newQuestion.id,
      attachmentId: attachment.id,
    });
    inMemoryQuestionAttachmentsRepository.items.push(questionAttachment);

    const result = await sut.execute({
      slug: 'example-question',
    });

    expect(result.isRight()).toBe(true);
    if (!result.isRight()) return;
    expect(result.value.question).toEqual(
      expect.objectContaining({
        questionId: newQuestion.id,
        title: newQuestion.title,
        content: newQuestion.content,
        slug: newQuestion.slug,
        attachments: [
          expect.objectContaining({
            title: 'Example attachment',
          }),
        ],
        author: 'John Doe',
      }),
    );
  });
});
