// @ts-ignore
import {Order} from '../domain/Order'

export class OrdersApi {
  public getOrder(): Order {
    return Order.create()
  }
}
