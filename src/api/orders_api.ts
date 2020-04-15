import {OrdersReadModel} from '../domain/orders/orders_readmodel'
import {UUID} from '../types'

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

  public getOrders(): OrderData[] {
    return this._readModel.getOrders()
  }
}
