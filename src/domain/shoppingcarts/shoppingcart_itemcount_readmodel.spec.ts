import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {toData} from '../../conversion'
import {ShoppingCartItem} from './shoppingcart'
import {PackagingType} from '../products/product'
import {ShoppingCartItemCountReadModel} from './shoppingcart_itemcount_readmodel'
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

describe('ShoppingCartItemCountReadModel', () => {
  let readModel: ShoppingCartItemCountReadModel
  const ID = '1'
  beforeEach(() => {
    readModel = new ShoppingCartItemCountReadModel()
  })
  describe('when creating an empty Shopping Cart', () => {
    beforeEach(() => {
      eventbus.dispatch({type: SHOPPING_CART_CREATED, payload: {id: ID, items: []}})
    })

    it('should return 0 items', () => {
      expect(readModel.getItemCount(ID)).toEqual(0)
    })

    it('should throw when querying unknown ShoppingCart items', () => {
      expect(() => readModel.getItemCount('unknown')).toThrow()
    })

    describe('and an item is added', () => {
      let itemData: ShoppingCartItemData

      beforeEach(() => {
        itemData = toData(ITEM)
        eventbus.dispatch({type: SHOPPING_CART_ITEM_ADDED, payload: {id: ID, items: [itemData]}})
      })

      it('return 1 item', () => {
        expect(readModel.getItemCount(ID)).toEqual(1)
      })

      describe('and the existing item is removed', () => {
        beforeEach(() => {
          eventbus.dispatch({type: SHOPPING_CART_ITEM_REMOVED, payload: {id: ID, items: []}})
        })

        it('should return 0 items', () => {
          expect(readModel.getItemCount(ID)).toEqual(0)
        })
      })

      describe('and the cart is checked out', () => {
        beforeEach(() => {
          eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: {id: ID, items: [itemData]}})
        })

        it('should throw when querying items', () => {
          expect(() => readModel.getItemCount(ID)).toThrow()
        })
      })
    })
  })
})



