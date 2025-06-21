import { Slug } from './slug';

describe('Slug value object', () => {
  it('should create a slug from text', () => {
    const slug = Slug.fromText('Example question title');
    expect(slug.value).toEqual('example-question-title');
  });

  it('should remove spaces and replace with empty string', () => {
    const slug = Slug.fromText('example   with   spaces');
    expect(slug.value).toEqual('example-with-spaces');
  });

  it('should convert to lowercase', () => {
    const slug = Slug.fromText('EXAMPLE TITLE');
    expect(slug.value).toEqual('example-title');
  });

  it('should remove special characters', () => {
    const slug = Slug.fromText('example! @#$% title');
    expect(slug.value).toEqual('example-title');
  });

  it('should replace underscores with hyphens', () => {
    const slug = Slug.fromText('example_title_here');
    expect(slug.value).toEqual('example-title-here');
  });

  it('should remove duplicate hyphens', () => {
    const slug = Slug.fromText('example--title--here');
    expect(slug.value).toEqual('example-title-here');
  });

  it('should remove trailing hyphens', () => {
    const slug = Slug.fromText('example title-');
    expect(slug.value).toEqual('example-title');
  });

  it('should handle accented characters', () => {
    const slug = Slug.fromText('café com leão');
    expect(slug.value).toEqual('cafe-com-leao');
  });
});
