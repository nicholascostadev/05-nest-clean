import { AggregateRoot } from '@/core/entities/aggregate-root';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id';
import type { Optional } from '@/core/types/optional';
import dayjs from 'dayjs';
import { QuestionBestAnswerChosenEvent } from '../events/question-best-answer-chosen-event';
import { QuestionAttachmentList } from './question-attachment-list';
import { Slug } from './value-objects/slug';

export interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId | null;
  title: string;
  slug: Slug;
  content: string;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date | null;
}

interface CreateQuestionProps
  extends Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'> {}

export class Question extends AggregateRoot<QuestionProps> {
  static create(props: CreateQuestionProps, id?: UniqueEntityId) {
    const question = new Question(
      {
        ...props,
        slug: props.slug ?? Slug.fromText(props.title),
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new QuestionAttachmentList(),
      },
      id,
    );

    return question;
  }

  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  set bestAnswerId(bestAnswerId: UniqueEntityId | undefined | null) {
    if (bestAnswerId === undefined || bestAnswerId === null) {
      return;
    }

    if (
      this.bestAnswerId === undefined ||
      this.bestAnswerId === null ||
      bestAnswerId !== this.props.bestAnswerId
    ) {
      this.addDomainEvent(
        new QuestionBestAnswerChosenEvent(this, bestAnswerId),
      );
    }

    this.props.bestAnswerId = bestAnswerId;

    this.touch();
  }

  get title() {
    return this.props.title;
  }

  set title(title: string) {
    this.props.title = title;
    this.props.slug = Slug.fromText(title);

    this.touch();
  }

  get slug() {
    return this.props.slug;
  }

  get content() {
    return this.props.content;
  }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get attachments() {
    return this.props.attachments;
  }

  set attachments(attachments: QuestionAttachmentList) {
    this.props.attachments = attachments;
    this.touch();
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3;
  }

  get excerpt() {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch() {
    this.props.updatedAt = new Date();
  }
}
