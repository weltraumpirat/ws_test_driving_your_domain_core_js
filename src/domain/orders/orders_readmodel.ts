import {
  ensure,
  UUID
} from '../../types'
import {ReadModel} from '../aggregate'
import {
  Event,
  Eventbus
} from '../../eventbus'
import {Global} from '../../global'
import {ORDER_CREATED} from './order_messages'
import {OrderData} from '../../api/orders_api'

export class OrdersReadModel extends ReadModel {
  public readonly orders: Map<UUID, OrderData>

  public constructor(eventbus: Eventbus = Global.eventbus) {
    super(eventbus)
    this.orders = new Map()
    this._eventbus.subscribe(ORDER_CREATED, this.receiveEvent.bind(this))
  }

  protected receiveEvent(event: Event): void {
    switch (event.type) {
      case ORDER_CREATED:
        this.notifyOrderCreated(event.payload)
        break
    }
  }

  private notifyOrderCreated(order: OrderData): void {
    this.orders.set(ensure(order.id), order)
  }

  public getOrders(): OrderData [] {
    return [...(this.orders.values())]
  }
}
