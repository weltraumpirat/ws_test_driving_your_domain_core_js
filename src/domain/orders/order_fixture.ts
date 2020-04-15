import {AggregateFixture} from '../aggregate'
import {
  Command,
  Eventbus
} from '../../eventbus'
import {Global} from '../../global'
import {CREATE_ORDER} from './order_messages'
import {OrderData} from '../../api/orders_api'
import {
  Order,
  OrderPosition,
  OrderRepository
} from './order'

export class OrderFixture extends AggregateFixture {
  private _repository: OrderRepository

  public constructor(repository: OrderRepository, eventbus: Eventbus = Global.eventbus) {
    super(eventbus)
    this._repository = repository
    eventbus.subscribe(CREATE_ORDER, this.receiveCommand.bind(this))
  }

  protected receiveCommand(command: Command): void {
    switch (command.type) {
      case CREATE_ORDER:
        this.createOrder(command.payload)
        break
    }
  }

  private createOrder(data: OrderData): void {
    const positions = data.positions.map(OrderPosition.fromData)
    const order = Order.create(...positions)
    this._repository.create(order)
  }
}
