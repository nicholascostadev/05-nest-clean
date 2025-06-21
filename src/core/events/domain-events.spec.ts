import { AggregateRoot } from '../entities/aggregate-root';
import type { UniqueEntityId } from '../entities/unique-entity-id';
import type { DomainEvent } from './domain-event';
import { DomainEvents } from './domain-events';

class CustomAggregateCreatedEvent implements DomainEvent {
  ocurredAt: Date;

  constructor(private aggregate: CustomAggregate) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<unknown> {
  static create() {
    const aggregate = new CustomAggregate({});

    aggregate.addDomainEvent(new CustomAggregateCreatedEvent(aggregate));

    return aggregate;
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn();

    DomainEvents.register(callbackSpy, CustomAggregateCreatedEvent.name);

    const aggregate = CustomAggregate.create();
    expect(aggregate.domainEvents).toHaveLength(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(callbackSpy).toHaveBeenCalled();
    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
