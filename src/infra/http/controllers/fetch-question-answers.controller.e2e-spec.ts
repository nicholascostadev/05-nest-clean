import { AppModule } from '@/infra/app.module';
import { HttpStatus } from '@nestjs/common';
import { test } from 'vitest';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { DatabaseModule } from '@/infra/database/database.module';
import { StudentFactory } from 'test/factories/make-student';
import { QuestionFactory } from 'test/factories/make-question';
import { AnswerFactory } from 'test/factories/make-answer';

describe('Fetch question answers (e2e)', () => {
  let app: NestExpressApplication;
  let studentFactory: StudentFactory;
  let questionFactory: QuestionFactory;
  let answerFactory: AnswerFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, AnswerFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    answerFactory = moduleRef.get(AnswerFactory);

    await app.init();
  });

  test('[GET] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    await Promise.all([
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        content: 'Answer 01',
        authorId: user.id,
      }),
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        content: 'Answer 02',
        authorId: user.id,
      }),
      answerFactory.makePrismaAnswer({
        questionId: question.id,
        content: 'Answer 03',
        authorId: user.id,
      }),
    ]);

    const questionId = question.id.toString();

    const response = await request(app.getHttpServer())
      .get(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      answers: expect.arrayContaining([
        expect.objectContaining({
          content: 'Answer 01',
        }),
        expect.objectContaining({
          content: 'Answer 02',
        }),
        expect.objectContaining({
          content: 'Answer 03',
        }),
      ]),
    });
  });
});
