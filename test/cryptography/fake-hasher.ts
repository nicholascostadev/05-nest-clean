import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
  async hash(plain: string): Promise<string> {
    return `hashed-${plain}`;
  }
  async compare(plain: string, hash: string): Promise<boolean> {
    return `hashed-${plain}` === hash;
  }
}
