import { AppModule } from '@/infra/app.module';
import { HttpStatus } from '@nestjs/common';
import { test } from 'vitest';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

describe('Fetch recent questions (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;
  let jwt: JwtService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    prisma = module.get(PrismaService);
    jwt = module.get(JwtService);

    await app.init();
  });

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: await hash('123456', 8),
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          slug: 'question-01',
          content: 'Question content',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          slug: 'question-02',
          content: 'Question content',
          authorId: user.id,
        },
        {
          title: 'Question 03',
          slug: 'question-03',
          content: 'Question content',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        title: 'New question',
        content: 'Question content',
      });

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({
          title: 'Question 01',
        }),
        expect.objectContaining({
          title: 'Question 02',
        }),
        expect.objectContaining({
          title: 'Question 03',
        }),
      ],
    });
  });
});
