import {UUID} from '../types'
import {
  Command,
  Event,
  Eventbus
} from '../eventbus'

export abstract class Aggregate {
  public id: UUID
  protected _eventbus: Eventbus

  protected constructor(id: UUID, eventbus: Eventbus) {
    this.id = id
    this._eventbus = eventbus
  }
}

export abstract class Service {
  protected _eventbus: Eventbus

  protected constructor(eventbus: Eventbus) {
    this._eventbus = eventbus
  }
}

export abstract class AggregateFixture {
  protected _eventbus: Eventbus

  public constructor(eventbus: Eventbus) {
    this._eventbus = eventbus
  }

  protected abstract receiveCommand(command: Command): void
}

export abstract class ReadModel {
  protected _eventbus: Eventbus

  public constructor(eventbus: Eventbus) {
    this._eventbus = eventbus
  }

  protected abstract receiveEvent(event: Event): void
}
