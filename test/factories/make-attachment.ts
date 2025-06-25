import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/unique-entity-id';
import {
  Attachment,
  AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment-mapper';

export function makeAttachment(
  override?: Partial<AttachmentProps>,
  id?: UniqueEntityId,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.sentence(),
      url: faker.internet.url(),
      ...override,
    },
    id,
  );

  return attachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private prismaService: PrismaService) {}

  async makePrismaAttachment(
    data: Partial<AttachmentProps> = {},
  ): Promise<Attachment> {
    const attachment = makeAttachment(data);

    await this.prismaService.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });

    return attachment;
  }
}
