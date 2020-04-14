import {OrdersReadModel} from '../domain/orders/orders_readmodel'
import {UUID} from '../types'
import {
  Order,
  OrderPosition
} from '../domain/orders/order'

export interface OrderPositionData {
  id?: string
  itemName: string
  count: number
  singlePrice: string
  combinedPrice: string
}

export interface OrderData {
  id?: UUID
  positions: OrderPositionData[]
  total?: string
}

export class OrdersApi {
  private _readModel: OrdersReadModel

  public constructor(readModel: OrdersReadModel) {
    this._readModel = readModel
  }

  public create(data: OrderData): void {
    const positions = data.positions.map(OrderPosition.fromData)
    Order.create(...positions)
  }
}
