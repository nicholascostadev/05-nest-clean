import { AppModule } from '@/infra/app.module';
import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';
import { QuestionFactory } from 'test/factories/make-question';
import { AttachmentFactory } from 'test/factories/make-attachment';
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment';
import { CacheRepository } from '@/infra/cache/cache-repository';
import { CacheModule } from '@/infra/cache/cache.module';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository';

describe('Prisma Questions Repository (e2e)', () => {
  let app: NestExpressApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let attachmentFactory: AttachmentFactory;
  let questionAttachmentFactory: QuestionAttachmentFactory;
  let questionsRepository: QuestionsRepository;
  let cacheRepository: CacheRepository;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule, CacheModule],
      providers: [
        StudentFactory,
        QuestionFactory,
        AttachmentFactory,
        QuestionAttachmentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory);
    questionsRepository = moduleRef.get(QuestionsRepository);
    cacheRepository = moduleRef.get(CacheRepository);
    await app.init();
  });

  it('should cache question details', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;

    const questionDetails =
      await questionsRepository.findBySlugWithDetails(slug);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    if (!cached) {
      throw new Error('Cached question details not found');
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    );
  });

  it('should return cached question details on subsequent calls', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;

    // await cacheRepository.set(
    //   `question:${slug}:details`,
    //   JSON.stringify({ empty: true }),
    // );
    let cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();

    await questionsRepository.findBySlugWithDetails(slug);

    cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).not.toBeNull();

    const questionDetails =
      await questionsRepository.findBySlugWithDetails(slug);

    if (!cached) {
      throw new Error('Cached question details not found');
    }

    expect(JSON.parse(cached)).toEqual(
      expect.objectContaining({
        id: questionDetails?.questionId.toString(),
      }),
    );
  });

  it('should reset question details cache when saving the question', async () => {
    const user = await studentFactory.makePrismaStudent();

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment = await attachmentFactory.makePrismaAttachment();

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      questionId: question.id,
      attachmentId: attachment.id,
    });

    const slug = question.slug.value;

    await cacheRepository.set(
      `question:${slug}:details`,
      JSON.stringify({ empty: true }),
    );

    await questionsRepository.save(question);

    const cached = await cacheRepository.get(`question:${slug}:details`);

    expect(cached).toBeNull();
  });
});
