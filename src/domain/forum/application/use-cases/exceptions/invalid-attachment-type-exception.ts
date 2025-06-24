import { UseCaseException } from '@/core/exceptions/use-case-exception';

export class InvalidAttachmentTypeException extends UseCaseException {
  constructor(fileType: string) {
    super(`Invalid attachment type: ${fileType}`);
  }
}
