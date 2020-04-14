import {
  ShoppingCartData,
  ShoppingCartFixture
} from './shoppingcart_fixture'
import {ShoppingCartRepositoryInMemory} from '../../persistence/shoppingcart_repository'
import {CheckoutService} from '../checkout/checkoutservice'
import {
  ShoppingCart,
  ShoppingCartItem
} from './shoppingcart'
import {PackagingType} from '../products/product'
import {toData} from '../../conversion'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {OrdersApi} from '../../api/orders_api'
import {ProductsReadModel} from '../products/products_readmodel'
import {ShoppingCartItemsReadModel} from './shoppingcart_items_readmodel'
import {OrdersReadModel} from '../orders/orders_readmodel'
import {ShoppingCartEmptyReadModel} from './shoppingcart_empty_readmodel'
import {UUID} from '../../types'
import {ShoppingCartItemCountReadModel} from './shoppingcart_itemcount_readmodel'
import {PRODUCT_CREATED} from '../products/product_messages'
import {
  ADD_ITEM_TO_SHOPPING_CART,
  CHECK_OUT_SHOPPING_CART,
  CREATE_SHOPPING_CART,
  REMOVE_ITEM_FROM_SHOPPING_CART,
  SHOPPING_CART_CHECKED_OUT,
  SHOPPING_CART_CREATED,
  SHOPPING_CART_ITEM_ADDED
} from './shoppingcart_messages'
import {Global} from '../../global'


jest.mock('../../api/products_api')
jest.mock('../../api/orders_api')

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
describe('ShoppingCartFixture', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let fixture: ShoppingCartFixture
  let productsReadModel: ProductsReadModel
  let repository: ShoppingCartRepositoryInMemory
  let itemsReadModel: ShoppingCartItemsReadModel
  let itemCountReadModel: ShoppingCartItemCountReadModel
  let emptyReadModel: ShoppingCartEmptyReadModel
  let ordersApi: OrdersApi
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let checkoutService: CheckoutService
  beforeEach(() => {
    productsReadModel = new ProductsReadModel()
    repository = new ShoppingCartRepositoryInMemory()
    itemsReadModel = new ShoppingCartItemsReadModel()
    emptyReadModel = new ShoppingCartEmptyReadModel()
    ordersApi = new OrdersApi(new OrdersReadModel())
    checkoutService = new CheckoutService(ordersApi)
    itemCountReadModel = new ShoppingCartItemCountReadModel()
    fixture = new ShoppingCartFixture(repository, productsReadModel)
  })
  describe('when creating an empty Shopping Cart', () => {
    let id: UUID
    beforeEach(async () => {
      id = await new Promise<UUID>(resolve => {
        eventbus.subscribeOnce(SHOPPING_CART_CREATED, ev =>
          resolve(ev.payload.id))
        eventbus.dispatch({type: CREATE_SHOPPING_CART, payload: []})
      })
    })

    it('should return the cart\'s ID', () => {
      expect(id).toBeDefined()
    })

    it('should store the cart in repository', () => {
      expect(repository.findById(id)).toBeDefined()
    })

    it('should consider the cart empty', () => {
      expect(emptyReadModel.isEmpty(id)).toBe(true)
    })

    it('should return no items for the cart', () => {
      expect(itemsReadModel.getItems(id)).toEqual([])
    })

    it('should return count of 0 items for the cart', () => {
      expect(itemCountReadModel.getItemCount(id)).toEqual(0)
    })

    describe('and an item is added', () => {
      let itemData: ShoppingCartItemData
      beforeEach(() => {
        itemData = toData(ITEM)
        // @ts-ignore
        // noinspection JSConstantReassignment
        productsReadModel.receiveEvent({type: PRODUCT_CREATED, payload: itemData})
      })

      describe('when the item is valid', () => {
        beforeEach(async () => {
          await new Promise<void>(resolve => {
            eventbus.subscribeOnce(SHOPPING_CART_ITEM_ADDED, () =>
              resolve())
            eventbus.dispatch({type: ADD_ITEM_TO_SHOPPING_CART, payload: {id: id, item: itemData}})
          })
        })
        it('should store the item', () => {
          expect(itemsReadModel.getItems(id)).toEqual([itemData])
        })

        it('should return item count of 1', () => {
          expect(itemCountReadModel.getItemCount(id)).toEqual(1)
        })
        it('should no longer consider the cart empty', () => {
          expect(emptyReadModel.isEmpty(id)).toBe(false)
        })
      })

      describe('when the item is invalid', () => {
        it('should throw', () => {
          expect(() => Global.eventbus.dispatch({
            type: ADD_ITEM_TO_SHOPPING_CART,
            payload: {id, item: {...itemData, name: 'invalid name'}}
          })).toThrow()
        })

        it('should not apply changes', () => {
          try {
            Global.eventbus.dispatch({
              type: ADD_ITEM_TO_SHOPPING_CART,
              payload: {id, item: {...itemData, name: 'invalid name'}}
            })
          } catch (_) {
          }
          expect(itemsReadModel.getItems(id)).toEqual([])
          expect(itemCountReadModel.getItemCount(id)).toEqual(0)
          expect(emptyReadModel.isEmpty(id)).toBe(true)
        })
      })

      describe('when the cart is unknown', () => {
        it('should throw', () => {
          expect(() => Global.eventbus.dispatch({
            type: ADD_ITEM_TO_SHOPPING_CART,
            payload: {id: 'unknown', item: itemData}
          })).toThrow()
        })
        it('should not apply changes', () => {
          try {
            Global.eventbus.dispatch({type: ADD_ITEM_TO_SHOPPING_CART, payload: {id: 'unknown', item: itemData}})
          } catch (_) {
          }
          expect(itemsReadModel.getItems(id)).toEqual([])
          expect(itemCountReadModel.getItemCount(id)).toEqual(0)
          expect(emptyReadModel.isEmpty(id)).toBe(true)
        })
      })
    })
  })

  describe('when a loaded ShoppingCart exists', () => {

    beforeEach(() => {
      const cart = ShoppingCart.restore('1', [ITEM])
      repository.create(cart)
      const cartData: ShoppingCartData = toData(cart)
      Global.eventbus.dispatch({type: SHOPPING_CART_CREATED, payload: cartData})
      Global.eventbus.dispatch({type: SHOPPING_CART_ITEM_ADDED, payload: cartData})
    })

    describe('and the cart is checked out', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let spy: any

      beforeEach(async () => {
        spy = jest.spyOn(ordersApi, 'create')
        await new Promise<UUID>(resolve => {
          eventbus.subscribeOnce(SHOPPING_CART_CHECKED_OUT, () =>
            resolve())
          eventbus.dispatch({type: CHECK_OUT_SHOPPING_CART, payload: '1'})
        })
      })
      it('should forward to orders api', () => {
        expect(spy).toHaveBeenCalled()
      })
      it('should not consider the cart empty', () => {
        expect(emptyReadModel.isEmpty('1')).toBe(false)
      })
      it('should throw when querying items', () => {
        expect(() => itemsReadModel.getItems('1')).toThrow()
      })
      it('should throw when querying item count', () => {
        expect(() => itemCountReadModel.getItemCount('1')).toThrow()
      })
    })

    it('should throw when trying to check out unknown ShoppingCart', () => {
      // @ts-ignore
      let spy = jest.spyOn(ordersApi, 'create')
      expect(() => Global.eventbus.dispatch({type: CHECK_OUT_SHOPPING_CART, payload: 'unknown'})).toThrow()
      expect(spy).not.toHaveBeenCalled()
    })


    describe('and removing the only existing item', () => {
      beforeEach(() => {
        Global.eventbus.dispatch({type: REMOVE_ITEM_FROM_SHOPPING_CART, payload: {id: '1', item: toData(ITEM)}})
      })

      it('should be empty', () => {
        expect(emptyReadModel.isEmpty('1')).toBe(true)
      })

      it('should return no items', () => {
        expect(itemsReadModel.getItems('1')).toEqual([])
      })
      it('should return item count 0', () => {
        expect(itemCountReadModel.getItemCount('1')).toEqual(0)
      })
    })

    it('should ignore when trying to remove a non-existing item', () => {
      const data: ShoppingCartItemData = toData(ITEM)
      const unknownItem = {...data, id: '0', name: 'unknown item'}
      Global.eventbus.dispatch({type: REMOVE_ITEM_FROM_SHOPPING_CART, payload: {id: '1', item: unknownItem}})

      expect(emptyReadModel.isEmpty('1')).toBe(false)
    })

    it('should throw when trying to remove an item from an unknown ShoppingCart', () => {
      expect(() =>
        Global.eventbus.dispatch({
          type: REMOVE_ITEM_FROM_SHOPPING_CART,
          payload: {id: 'unknown', item: toData(ITEM)}
        })
      ).toThrow()
    })
  })
  afterEach(() => {
    eventbus.release()
  })
})
