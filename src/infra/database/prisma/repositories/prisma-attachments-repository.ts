import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { PrismaAttachmentMapper } from '../mappers/prisma-attachment-mapper';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prismaService: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    await this.prismaService.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });
  }
}
