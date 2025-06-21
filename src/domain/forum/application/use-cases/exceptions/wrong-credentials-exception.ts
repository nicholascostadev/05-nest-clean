import { UseCaseException } from '@/core/exceptions/use-case-exception';

export class WrongCredentialsException extends UseCaseException {
  constructor() {
    super('Credentitals are invalid');
  }
}
