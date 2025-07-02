import { PrismaClient } from '@prisma/client';

export class PrismaTestService extends PrismaClient {
  constructor(databaseUrl: string) {
    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }
}
