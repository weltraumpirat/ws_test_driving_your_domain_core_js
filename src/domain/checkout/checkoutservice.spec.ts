import {CheckoutService} from './checkoutservice'
import {equalOrderIgnoringIds} from '../../comparison'
import {ShoppingCartItem} from '../shoppingcarts/shoppingcart'
import {
  Order,
  OrderPosition
} from '../orders/order'
import {OrdersApi} from '../../api/orders_api'
import {OrdersReadModel} from '../orders/orders_readmodel'
import {SHOPPING_CART_CHECKED_OUT} from '../shoppingcarts/shoppingcart_messages'
import {Eventbus} from '../../eventbus'
import {Global} from '../../global'

describe('CheckoutService:', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let checkoutService: CheckoutService
  let readModel: OrdersReadModel
  const eventbus: Eventbus = Global.eventbus

  beforeEach(() => {
    readModel = new OrdersReadModel()
    const api = new OrdersApi(readModel)
    checkoutService = new CheckoutService(api)

  })
  describe('when a shopping cart is checked out with zero items', () => {
    beforeEach(() => {
      eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: {items: []}})
    })
    it('should create an empty Order', () => {
      const order = readModel.getOrders()[0]
      const expectedOrder = {
        id: '1',
        total: '0 EUR',
        positions: []
      }
      expect(equalOrderIgnoringIds(order, expectedOrder)).toBe(true)
    })
  })

  describe('when a shopping cart is checked out with a single item', ()=>{
    beforeEach(()=>{
      const item = ShoppingCartItem.restore(
        '1',
        'Whole Milk',
        'Carton',
        '1l',
        '1.19 EUR'
      )
      eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: {items: [item]}})
    })
    it('should create an Order with a single position', () => {
      const order = readModel.getOrders()[0]
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
      expect(equalOrderIgnoringIds(order, expectedOrder)).toBe(true)
    })
  })

  describe('when a shopping cart is checked out with two identical items', () => {
    beforeEach(()=>{
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
      eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: {items: [item1, item2]}})
    })

    it('should create an Order with a single position', () => {
      const order = readModel.getOrders()[0]
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
      expect(equalOrderIgnoringIds(order, expectedOrder))
        .toBe(true)
    })
  })


  afterEach(() => {
    eventbus.release()
  })
})
