import { type Either, left, right } from '@/core/either';
import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import { NotAllowedException } from '@/core/exceptions/not-allowed-error';
import { ResourceNotFoundException } from '@/core/exceptions/resource-not-found-exception';
import type { Question } from '../../enterprise/entities/question';
import { QuestionAttachment } from '../../enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list';
import type { QuestionAttachmentsRepository } from '../repositories/question-attachments-repository';
import type { QuestionsRepository } from '../repositories/questions-repository';

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type EditQuestionUseCaseResponse = Either<
  ResourceNotFoundException | NotAllowedException,
  {
    question: Question;
  }
>;

export class EditQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
    attachmentsIds,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundException());
    }

    if (authorId !== question.authorId.toString()) {
      return left(new NotAllowedException());
    }

    // Get the question attachments from database
    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    // Build the watched list of question attachments
    const questionAttachmentsList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    // Build the new question attachments, received from the request
    const questionAttachments = attachmentsIds.map((id) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId(id),
        questionId: question.id,
      }),
    );

    // Update the watched list of question attachemnts
    questionAttachmentsList.update(questionAttachments);

    question.title = title;
    question.content = content;
    // In this case we have the "diff" between the current question attachments and the new ones
    // So we need to update the question attachments list
    // _PS: Yes, this comment was written by me, not an AI bc I'm making sure I understood it better,
    question.attachments = questionAttachmentsList;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
