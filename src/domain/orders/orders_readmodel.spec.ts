import {Global} from '../../global'
import {OrdersReadModel} from './orders_readmodel'
import {ORDER_CREATED} from './order_messages'
import {OrderData} from '../../api/orders_api'
import {toData} from '../../conversion'
import {
  Order,
  OrderPosition
} from './order'

const eventbus = Global.eventbus
describe('OrdersReadModel', () => {
  let ordersReadModel: OrdersReadModel
  beforeEach(() => {
    ordersReadModel = new OrdersReadModel()
  })

  describe('when creating a new order', () => {
    beforeEach(() => {
      const order: OrderData = toData(Order.restore(
        '1',
        OrderPosition.restore(
          '1',
          'Whole Milk, 1l Carton',
          1,
          '1.19 EUR',
          '1.19 EUR'
        )
      ))
      eventbus.dispatch({type: ORDER_CREATED, payload: order})
    })
    it('should return one order', () => {
      expect(ordersReadModel.getOrders()).toHaveLength(1)
    })
  })
})
