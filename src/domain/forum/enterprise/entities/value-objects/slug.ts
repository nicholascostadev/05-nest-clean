export class Slug {
  public value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(slug: string) {
    return new Slug(slug);
  }

  /**
   * Creates a URL-friendly slug from a text string
   *
   * @param text - The text to convert into a slug
   * @returns A new Slug instance containing the formatted slug string
   *
   * @example
   * const slug = Slug.fromText('Example Title!')
   * // Returns slug with value 'example-title'
   */
  static fromText(text: string) {
    const slug = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    return new Slug(slug);
  }
}
