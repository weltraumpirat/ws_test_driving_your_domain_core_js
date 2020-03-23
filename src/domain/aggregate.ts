import {UUID} from '../types'

export abstract class Aggregate {
  public readonly id: UUID

  protected constructor(id: UUID) {
    this.id = id
  }
}
