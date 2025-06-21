import { UseCaseException } from '@/core/exceptions/use-case-exception';

export class ResourceNotFoundException extends UseCaseException {
  constructor() {
    super('Resource not found');
  }
}
