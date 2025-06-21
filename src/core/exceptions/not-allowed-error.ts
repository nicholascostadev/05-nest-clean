import { UseCaseException } from '@/core/exceptions/use-case-exception';

export class NotAllowedException extends UseCaseException {
  constructor() {
    super('Not allowed');
  }
}
