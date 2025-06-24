import { AppModule } from '@/infra/app.module';
import { HttpStatus } from '@nestjs/common';
import { test } from 'vitest';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { hash } from 'bcryptjs';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Authenticate (e2e)', () => {
  let app: NestExpressApplication;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[POST] /sessions', async () => {
    await studentFactory.makePrismaStudent({
      email: 'john.doe@example.com',
      password: await hash('123456', 8),
    });

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(HttpStatus.OK);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });
});
