import {OrderData} from '../domain/shoppingcart_fixture'
import {toData} from '../conversion'
import {OrdersReadModel} from '../domain/orders_readmodel'

export class OrdersApi {
  private _readModel: OrdersReadModel

  public constructor(readModel: OrdersReadModel) {
    this._readModel = readModel
  }

  public create(order: OrderData): void {
    this._readModel.notifyOrderCreated({...toData(order), total: order.total})
  }
}
