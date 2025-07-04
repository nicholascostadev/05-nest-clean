import { UniqueEntityId } from './unique-entity-id';

export abstract class Entity<T> {
  private _id: UniqueEntityId;
  protected props: T;

  protected constructor(props: T, id?: UniqueEntityId) {
    this.props = props;
    this._id = id ?? new UniqueEntityId();
  }

  get id() {
    return this._id;
  }

  equals(entity: Entity<unknown>) {
    if (entity === this) return true;

    if (entity.id === this._id) return true;

    return false;
  }
}
