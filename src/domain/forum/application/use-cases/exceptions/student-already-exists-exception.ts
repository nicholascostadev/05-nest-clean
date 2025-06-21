import { UseCaseException } from '@/core/exceptions/use-case-exception';

export class StudentAlreadyExistsException extends UseCaseException {
  constructor(identifier: string) {
    super(`Student with e-mail address "${identifier}" already exists`);
  }
}
