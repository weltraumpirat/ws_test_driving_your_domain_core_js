import {UUID} from '../types'
import {
  Command,
  Eventbus,
  Listener
} from '../eventbus'

export abstract class Aggregate {
  public id: UUID
  protected _eventbus: Eventbus

  protected constructor(id: UUID, eventbus: Eventbus) {
    this.id = id
    this._eventbus = eventbus
  }

  public subscribeOnce(type: string, listener: Listener): void {
    this._eventbus.subscribeOnce(type, listener)
  }
}

export interface AggregateFixture {
  receiveCommand(command: Command): void
}
