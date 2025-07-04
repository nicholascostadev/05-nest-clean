export abstract class ValueObject<T> {
  protected props: T;

  protected constructor(props: T) {
    this.props = props;
  }

  equals(vo: ValueObject<unknown>) {
    if (vo == null) return false;

    if (vo.props === undefined) return false;

    return JSON.stringify(vo.props) === JSON.stringify(this.props);
  }
}
