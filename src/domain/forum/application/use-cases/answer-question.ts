import { type Either, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { Answer } from '../../enterprise/entities/answer';
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list';
import { AnswersRepository } from '../repositories/answers-repsitory';
import { Injectable } from '@nestjs/common';

interface AnswerQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<
  null,
  {
    answer: Answer;
  }
>;

@Injectable()
export class AnswerQuestionUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((id) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityId(id),
        answerId: answer.id,
      }),
    );

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({
      answer,
    });
  }
}
