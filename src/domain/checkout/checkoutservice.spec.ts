import {CheckoutService} from './checkoutservice'
import {equalOrderIgnoringIds} from '../../comparison'
import {ShoppingCartItem} from '../shoppingcarts/shoppingcart'
import {
  Order,
  OrderPosition
} from '../orders/order'
import {OrderData} from '../../api/orders_api'
import {SHOPPING_CART_CHECKED_OUT} from '../shoppingcarts/shoppingcart_messages'
import {Eventbus} from '../../eventbus'
import {Global} from '../../global'
import {CREATE_ORDER} from '../orders/order_messages'
import {toData} from '../../conversion'

const eventbus: Eventbus = Global.eventbus

describe('CheckoutService:', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let checkoutService: CheckoutService
  let order: OrderData

  beforeEach(() => {
    checkoutService = new CheckoutService()

  })
  describe('when a shopping cart is checked out with zero items', () => {
    let order: OrderData
    beforeEach(async () => {
      order = await new Promise(resolve => {
        eventbus.subscribeOnce(CREATE_ORDER, ev => resolve(ev.payload))
        eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: {items: []}})
      })
    })
    it('should create an empty Order', () => {
      const expectedOrder: OrderData = {
        positions: []
      }
      expect(equalOrderIgnoringIds(order, expectedOrder)).toBe(true)
    })
  })

  describe('when a shopping cart is checked out with a single item', () => {
    beforeEach(async () => {
      order = await new Promise(resolve => {
        eventbus.subscribeOnce(CREATE_ORDER, ev => resolve(ev.payload))
        const item = ShoppingCartItem.restore(
          '1',
          'Whole Milk',
          'Carton',
          '1l',
          '1.19 EUR'
        )
        eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: {items: [item]}})
      })
    })
    it('should create an Order with a single position', () => {
      const expectedOrder: OrderData = toData(Order.restore(
        '1',
        OrderPosition.restore(
          '1',
          'Whole Milk, 1l Carton',
          1,
          '1.19 EUR',
          '1.19 EUR'
        )
      ))
      expect(equalOrderIgnoringIds(order, expectedOrder)).toBe(true)
    })
  })

  describe('when a shopping cart is checked out with two identical items', () => {
    beforeEach(async () => {

      order = await new Promise(resolve => {
        eventbus.subscribeOnce(CREATE_ORDER, ev => resolve(ev.payload))
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

    })

    it('should create an Order with a single position', () => {
      const expectedOrder: OrderData = toData(Order.restore(
        '1',
        OrderPosition.restore(
          '1',
          'Whole Milk, 1l Carton',
          2,
          '1.19 EUR',
          '2.38 EUR'
        )
      ))
      expect(equalOrderIgnoringIds(order, expectedOrder))
        .toBe(true)
    })
  })


  afterEach(() => {
    eventbus.release()
  })
})
