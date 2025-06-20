import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '@/auth/jwt-auth.guard';
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe';
import { PrismaService } from '@/prisma/prisma.service';
import z from 'zod/v4';

const PageQueryParamSchema = z.coerce.number().min(1).default(1);

const QueryValidationPipe = new ZodValidationPipe(PageQueryParamSchema);

type PageQueryParam = z.infer<typeof PageQueryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private prismaService: PrismaService) {}

  @Get()
  async handle(@Query('page', QueryValidationPipe) page: PageQueryParam) {
    const perPage = 1;

    const questions = await this.prismaService.question.findMany({
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { questions };
  }
}
