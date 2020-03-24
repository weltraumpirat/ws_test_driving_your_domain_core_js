import {UUID} from '../types'
import {OrderData} from './shoppingcart_fixture'

export class OrdersReadModel {
  public readonly orders: Map<UUID, OrderData>

  public constructor() {
    this.orders = new Map()
  }

  public notifyOrderCreated(order: OrderData): void {
    this.orders.set(order.id, order)
  }
}
