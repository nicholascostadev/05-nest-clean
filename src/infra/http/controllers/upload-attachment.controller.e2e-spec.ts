import { AppModule } from '@/infra/app.module';
import { HttpStatus } from '@nestjs/common';
import { test } from 'vitest';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { JwtService } from '@nestjs/jwt';
import { StudentFactory } from 'test/factories/make-student';
import { DatabaseModule } from '@/infra/database/database.module';

describe('Upload attachment (e2e)', () => {
  let app: NestExpressApplication;
  let studentFactory: StudentFactory;
  let jwt: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);
    studentFactory = moduleRef.get(StudentFactory);
    await app.init();
  });

  test('[POST] /attachments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const response = await request(app.getHttpServer())
      .post(`/attachments`)
      .attach('file', './test/e2e/sample-upload.jpg')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(HttpStatus.CREATED);
    expect(response.body).toEqual({
      attachmentId: expect.any(String),
    });
  });
});
