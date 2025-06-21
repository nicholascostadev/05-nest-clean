import type { DomainEvent } from '../events/domain-event';
import { DomainEvents } from '../events/domain-events';
import { Entity } from './entity';

export abstract class AggregateRoot<T> extends Entity<T> {
  private _domainEvents: DomainEvent[] = [];

  get domainEvents() {
    return this._domainEvents;
  }

  protected addDomainEvent(domainEvent: DomainEvent) {
    this._domainEvents.push(domainEvent);
    DomainEvents.markAggregateForDispatch(this);
  }

  clearEvents() {
    this._domainEvents = [];
  }
}
