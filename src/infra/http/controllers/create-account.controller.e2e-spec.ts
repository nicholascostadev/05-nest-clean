import { AppModule } from '@/infra/app.module';
import { HttpStatus } from '@nestjs/common';
import { test } from 'vitest';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Create account (e2e)', () => {
  let app: NestExpressApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();

    prisma = module.get(PrismaService);

    await app.init();
  });

  test('[POST] /accounts', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: '123456',
    });

    expect(response.statusCode).toBe(HttpStatus.CREATED);

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: 'john.doe@example.com',
      },
    });

    expect(userOnDatabase).toBeTruthy();
  });
});
