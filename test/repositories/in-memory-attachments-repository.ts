import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class InMemoryAttachmentsRepository implements AttachmentsRepository {
  items: Attachment[] = [];

  async create(attachment: Attachment) {
    this.items.push(attachment);
  }
}
