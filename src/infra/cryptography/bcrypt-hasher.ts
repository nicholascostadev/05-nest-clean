import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { hash, compare } from 'bcryptjs';

export class BcryptHasher implements HashGenerator, HashComparer {
  private SALT_ROUNDS = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.SALT_ROUNDS);
  }

  compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash);
  }
}
