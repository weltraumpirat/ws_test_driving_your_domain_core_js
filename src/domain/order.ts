// @ts-ignore
import uuid from 'uuid/v4'

export class OrderPosition {
  constructor(public readonly id: string,
    public readonly itemName: string,
    public readonly count: number,
    public readonly singlePrice: string,
    public readonly combinedPrice: string) {
  }

  public static create(
    itemName: string,
    count: number,
    singlePrice: string,
    combinedPrice: string) {
    return new OrderPosition(uuid(), itemName, count, singlePrice, combinedPrice)
  }

  public static restore(id: string,
    itemName: string,
    count: number,
    singlePrice: string,
    combinedPrice: string) {
    return new OrderPosition(id, itemName, count, singlePrice, combinedPrice)
  }
}

export class Order {

  constructor(public readonly id: string, public readonly positions: OrderPosition[]) {
  }

  public get total(): string {
    const calc: number = this.positions.reduce((total: number, p: OrderPosition) => total + parseFloat(p.combinedPrice), 0)
    return calc + ' EUR'
  }

  public static create(...positions: OrderPosition[]) {
    return new Order(uuid(), positions)
  }

  public static restore(id: string, ...positions: OrderPosition[]) {
    return new Order(id, positions)
  }
}
