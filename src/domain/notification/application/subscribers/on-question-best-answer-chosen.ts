import { DomainEvents } from '@/core/events/domain-events';
import type { EventHandler } from '@/core/events/event-handler';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers-repsitory';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen-event';
import type { SendNotificationUseCase } from '../use-cases/send-notification';

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private answersRepository: AnswersRepository,
    private sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendQuestionBestAnswerChosenNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerChosenNotification({
    question,
    bestAnswerId,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toString(),
    );

    if (answer) {
      await this.sendNotification.execute({
        recipientId: answer.authorId.toString(),
        title: 'Your answer was chosen by the author of the question!',
        content: `The answer you wrote on the question "${question.title
          .substring(0, 20)
          .concat('...')}" was chosen by the author`,
      });
    }
  }
}
