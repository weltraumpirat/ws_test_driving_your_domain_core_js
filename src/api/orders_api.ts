import {OrderData} from '../domain/shoppingcart_fixture'
import {toData} from '../conversion'
import {UUID} from '../types'

export class OrdersReadModel {
  public readonly orders: Map<UUID, OrderData>

  public constructor() {
    this.orders = new Map()
  }

  public notifyOrderCreated(order: OrderData): void {
    this.orders.set(order.id, order)
  }
}

export class OrdersApi {
  private _readModel: OrdersReadModel

  public constructor(readModel: OrdersReadModel) {
    this._readModel = readModel
  }

  public create(order: OrderData): void {
    this._readModel.notifyOrderCreated({...toData(order), total: order.total})
  }
}
