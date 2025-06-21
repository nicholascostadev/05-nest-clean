import { type Either, left, right } from './either';

function doSomething(shouldSucceed: boolean): Either<string, number> {
  if (shouldSucceed) {
    return right(1);
  }

  return left('10');
}

test('success result', () => {
  const result = doSomething(true);

  expect(result.isRight()).toBe(true);
  expect(result.isLeft()).toBe(false);
});

test('error result', () => {
  const result = doSomething(false);

  expect(result.isRight()).toBe(false);
  expect(result.isLeft()).toBe(true);
});
