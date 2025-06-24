import { AppModule } from '@/infra/app.module';
import { HttpStatus } from '@nestjs/common';
import { test } from 'vitest';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '@/infra/database/database.module';
import { StudentFactory } from 'test/factories/make-student';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { QuestionFactory } from 'test/factories/make-question';
import { QuestionCommentFactory } from 'test/factories/make-question-comment';

describe('Delete question comment (e2e)', () => {
  let app: NestExpressApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;
  let questionCommentFactory: QuestionCommentFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, QuestionCommentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    prisma = moduleRef.get(PrismaService);
    questionFactory = moduleRef.get(QuestionFactory);
    questionCommentFactory = moduleRef.get(QuestionCommentFactory);
    await app.init();
  });

  test('[DELETE] /questions/comments/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionComment =
      await questionCommentFactory.makePrismaQuestionComment({
        questionId: question.id,
        authorId: user.id,
      });

    const questionCommentId = questionComment.id.toString();

    const response = await request(app.getHttpServer())
      .delete(`/questions/comments/${questionCommentId}`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(HttpStatus.NO_CONTENT);

    const questionCommentOnDatabase = await prisma.comment.findUnique({
      where: {
        id: questionCommentId,
      },
    });
    expect(questionCommentOnDatabase).toBeNull();
  });
});
