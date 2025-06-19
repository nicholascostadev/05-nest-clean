import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/current-user-decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UserPayload } from 'src/auth/jwt.strategy';
import { ZodValidationPipe } from 'src/pipes/zod-validation-pipe';
import { PrismaService } from 'src/prisma/prisma.service';
import z from 'zod/v4';

const CreateQuestionBodySchema = z.object({
  title: z.string(),
  content: z.string(),
});

type CreateQuestionBody = z.infer<typeof CreateQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private prismaService: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(CreateQuestionBodySchema))
    body: CreateQuestionBody,
  ) {
    const { title, content } = CreateQuestionBodySchema.parse(body);

    const question = await this.prismaService.question.create({
      data: {
        title,
        content,
        slug: this.convertToSlug(title),
        authorId: user.sub,
      },
    });

    return { question };
  }

  private convertToSlug(text: string): string {
    if (!text) {
      return '';
    }

    return text
      .toString()
      .toLowerCase()
      .normalize('NFD') // Decompose combined graphemes
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/&/g, '-and-') // Replace & with 'and'
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .replace(/^-+/, '') // Trim - from start of text
      .replace(/-+$/, ''); // Trim - from end of text
  }
}
