import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/not-allowed-error';
import { makeQuestion } from 'test/factories/make-question';
import { makeQuestionAttachment } from 'test/factories/make-question-attachment';
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository';
import { Slug } from '../../enterprise/entities/value-objects/slug';
import { EditQuestionUseCase } from './edit-question';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );
    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    );
  });

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toString(),
      title: 'New title',
      content: 'New content',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items).toHaveLength(1);
    expect(inMemoryQuestionsRepository.items[0]).toEqual(
      expect.objectContaining({
        title: 'New title',
        content: 'New content',
      }),
    );
    expect(
      inMemoryQuestionsRepository.items[0].attachments.getItems(),
    ).toHaveLength(2);
    expect(inMemoryQuestionsRepository.items[0].attachments.getItems()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ]),
    );
  });

  it('should not be able to edit a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toString(),
      title: 'New title',
      content: 'New content',
      attachmentsIds: [],
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedException);
  });

  it('should sync new and removed attachments when editing a question', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionsRepository.create(newQuestion);
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    );

    const result = await sut.execute({
      authorId: 'author-1',
      questionId: newQuestion.id.toString(),
      title: 'New title',
      content: 'New content',
      attachmentsIds: ['1', '3'],
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ]),
    );
  });
});
