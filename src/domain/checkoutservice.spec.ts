import {CheckoutService} from './checkoutservice'
import {equalOrderIgnoringIds} from '../comparison'
import {ShoppingCartItem} from './shoppingcart'
import {
  Order,
  OrderPosition
} from './order'
import {
  OrdersApi,
  OrdersReadModel
} from '../api/orders_api'

describe('CheckoutService:', () => {
  let checkoutService: CheckoutService
  let readModel: OrdersReadModel

  beforeEach(()=>{
    readModel = new OrdersReadModel()
    const api = new OrdersApi(readModel)
    checkoutService = new CheckoutService(api)

  })
  it('should create an empty Order from zero shopping cart items', () => {
    const expectedOrder = {
      id: '1',
      total: '0 EUR',
      positions: []
    }
    checkoutService.checkOut([])
    const order = readModel.orders.values().next()
    expect(equalOrderIgnoringIds(order.value, expectedOrder)).toBe(true)
  })

  it('should create an Order with a single position from one shopping cart item', () => {
    const item1 = ShoppingCartItem.restore(
      '1',
      'Whole Milk',
      'Carton',
      '1l',
      '1.19 EUR'
    )
    const expectedOrder = Order.restore(
      '1',
      OrderPosition.restore(
        '1',
        'Whole Milk, 1l Carton',
        1,
        '1.19 EUR',
        '1.19 EUR'
      )
    )
    checkoutService.checkOut([item1])
    const order = readModel.orders.values().next()
    expect(equalOrderIgnoringIds(order.value, expectedOrder)).toBe(true)
  })

  it('should create an Order with a single position from two shopping cart items', () => {
    const item1 = ShoppingCartItem.restore(
      '1',
      'Whole Milk',
      'Carton',
      '1l',
      '1.19 EUR'
    )
    const item2 = ShoppingCartItem.restore(
      '1',
      'Whole Milk',
      'Carton',
      '1l',
      '1.19 EUR'
    )
    const expectedOrder = Order.restore(
      '1',
      OrderPosition.restore(
        '1',
        'Whole Milk, 1l Carton',
        2,
        '1.19 EUR',
        '2.38 EUR'
      )
    )
    checkoutService.checkOut([item1, item2])
    const order = readModel.orders.values().next()
    expect(equalOrderIgnoringIds(order.value, expectedOrder))
      .toBe(true)
  })
})
