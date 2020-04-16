import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {toData} from '../../conversion'
import {ShoppingCartItem} from './shoppingcart'
import {PackagingType} from '../products/product'
import {
  ShoppingCartEmptyReadModel
} from './shoppingcart_empty_readmodel'
import {Global} from '../../global'
import {
  SHOPPING_CART_CHECKED_OUT,
  SHOPPING_CART_CREATED,
  SHOPPING_CART_ITEM_ADDED,
  SHOPPING_CART_ITEM_REMOVED
} from './shoppingcart_messages'

const ITEM = ShoppingCartItem.fromData(
  {
    id: '1',
    name: 'Whole Milk',
    packagingType: PackagingType.CARTON,
    amount: '1L',
    price: '1.19 EUR'
  }
)
const eventbus = Global.eventbus

describe('ShoppingCartEmptyReadModel', () => {
  let readModel: ShoppingCartEmptyReadModel
  const ID = '1'
  beforeEach(() => {
    readModel = new ShoppingCartEmptyReadModel()
  })
  describe('when creating an empty Shopping Cart', () => {
    beforeEach(() => {
      eventbus.dispatch({type: SHOPPING_CART_CREATED, payload: {id: ID, items: []}})
    })

    it('should consider the cart empty', () => {
      expect(readModel.isEmpty(ID)).toBe(true)
    })

    it('should not consider unknown ShoppingCarts empty', () => {
      expect(readModel.isEmpty('unknown')).toBe(false)
    })

    describe('and an item is added', () => {
      let itemData: ShoppingCartItemData

      beforeEach(() => {
        itemData = toData(ITEM)
        eventbus.dispatch({type: SHOPPING_CART_ITEM_ADDED, payload: {id: ID, items: [itemData]}})
      })

      it('not consider the cart empty', () => {
        expect(readModel.isEmpty(ID)).toBe(false)
      })

      describe('and the last existing item is removed', () => {
        beforeEach(() => {
          eventbus.dispatch({type: SHOPPING_CART_ITEM_REMOVED, payload: {id: ID, items: []}})
        })

        it('should consider the cart empty', () => {
          expect(readModel.isEmpty(ID)).toBe(true)
        })
      })

      describe('and the cart is checked out', () => {
        beforeEach(() => {
          eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: {id: ID, items: [itemData]}})
        })

        it('should not consider the cart empty', () => {
          expect(readModel.isEmpty(ID)).toBe(false)
        })
      })
    })
  })
})



