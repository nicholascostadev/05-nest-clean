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
import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';

describe('Comment on answer (e2e)', () => {
  let app: NestExpressApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let studentFactory: StudentFactory;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    prisma = moduleRef.get(PrismaService);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    await app.init();
  });

  test('[POST] /answers/:answerId/comments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toString();

    const response = await request(app.getHttpServer())
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'New comment',
      });

    expect(response.statusCode).toBe(HttpStatus.CREATED);

    const answerCommentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'New comment',
      },
    });

    expect(answerCommentOnDatabase).toBeTruthy();
  });
});
