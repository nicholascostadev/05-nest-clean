import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/not-allowed-error';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import type { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswerAttachmentsRepository } from '../repositories/answer-attachments-repository';
import { AnswersRepository } from '../repositories/answers-repsitory';
import { Injectable } from '@nestjs/common';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<
  ResourceNotFoundException | NotAllowedException,
  {
    answer: Answer;
  }
>;

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundException());
    }

    if (authorId !== answer.authorId.toString()) {
      return left(new NotAllowedException());
    }

    const currentAnswerAttachments =
      await this.answerAttachmentsRepository.findManyByAnswerId(
        answer.id.toString(),
      );

    const answerAttachmentList = new AnswerAttachmentList(
      currentAnswerAttachments,
    );

    const answerAttachments = attachmentsIds.map((id) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityId(id),
        answerId: answer.id,
      }),
    );

    answerAttachmentList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;

    await this.answersRepository.save(answer);

    return right({
      answer,
    });
  }
}
