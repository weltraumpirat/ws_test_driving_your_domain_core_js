// @ts-ignore
import uuid from 'uuid/v4'
import {Aggregate} from '../aggregate'
import {Global} from '../../global'
import {toData} from '../../conversion'
import {ORDER_CREATED} from './order_messages'
import {OrderPositionData} from '../../api/orders_api'

export class OrderPosition {
  public readonly id: string
  public readonly itemName: string
  public readonly count: number
  public readonly singlePrice: string
  public readonly combinedPrice: string

  public constructor(
    id: string,
    itemName: string,
    count: number,
    singlePrice: string,
    combinedPrice: string) {
    this.combinedPrice = combinedPrice
    this.singlePrice = singlePrice
    this.count = count
    this.itemName = itemName
    this.id = id
  }

  public static create(
    itemName: string,
    count: number,
    singlePrice: string,
    combinedPrice: string): OrderPosition {
    return new OrderPosition(uuid(), itemName, count, singlePrice, combinedPrice)
  }

  public static restore(
    id: string,
    itemName: string,
    count: number,
    singlePrice: string,
    combinedPrice: string): OrderPosition {
    return new OrderPosition(id, itemName, count, singlePrice, combinedPrice)
  }

  public static fromData(
    data: OrderPositionData): OrderPosition {
    return new OrderPosition(data.id || uuid(), data.itemName, data.count, data.singlePrice, data.combinedPrice)
  }
}

export class Order extends Aggregate {
  public readonly positions: OrderPosition[]

  public constructor(id: string, positions: OrderPosition[]) {
    super(id, Global.eventbus)
    this.positions = positions
    this._eventbus.dispatch({type: ORDER_CREATED, payload: {...toData(this), total: this.total}})
  }

  public get total(): string {
    const calc: number = this.positions.reduce((total: number, p: OrderPosition) => total + parseFloat(p.combinedPrice), 0)
    return calc + ' EUR'
  }

  public static create(...positions: OrderPosition[]): Order {
    return new Order(uuid(), positions)
  }

  public static restore(id: string, ...positions: OrderPosition[]): Order {
    return new Order(id, positions)
  }
}

export interface OrderRepository {
  findAll(): Order[]

  create(order: Order): void
}
