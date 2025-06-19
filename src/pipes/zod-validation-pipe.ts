import { PipeTransform, BadRequestException, HttpStatus } from '@nestjs/common';
import { ZodError, ZodType } from 'zod/v4';
import { fromZodError } from 'zod-validation-error/v4';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodType) {}

  transform(value: unknown) {
    try {
      const parsedValue = this.schema.parse(value);

      return parsedValue;
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          errors: fromZodError(error),
          message: 'Validation failed',
          statusCode: HttpStatus.BAD_REQUEST,
        });
      }

      throw new BadRequestException('Validation failed');
    }
  }
}
