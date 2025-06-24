import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import z from 'zod/v4';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer';

const EditAnswerBodySchema = z.object({
  content: z.string(),
});

type EditAnswerBody = z.infer<typeof EditAnswerBodySchema>;

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(new ZodValidationPipe(EditAnswerBodySchema))
    body: EditAnswerBody,
    @Param('id')
    answerId: string,
  ) {
    const { content } = EditAnswerBodySchema.parse(body);

    const result = await this.editAnswer.execute({
      answerId,
      content,
      authorId: user.sub,
      attachmentsIds: [],
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
