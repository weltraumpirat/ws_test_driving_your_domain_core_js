import {
  Order,
  OrderRepository
} from '../domain/orders/order'
import {UUID} from '../types'

export class OrderRepositoryInMemory implements OrderRepository {
  private readonly orders: Map<UUID, Order>

  public constructor() {
    this.orders = new Map()
  }

  public findAll(): Order[] {
    return [...(this.orders.values())]
  }

  public create(order: Order): void {
    this.orders.set(order.id, order)
  }
}
