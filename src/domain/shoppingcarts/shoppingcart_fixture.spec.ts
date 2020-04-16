import {
  ShoppingCartData,
  ShoppingCartFixture
} from './shoppingcart_fixture'
import {ShoppingCartRepositoryInMemory} from '../../persistence/shoppingcart_repository'
import {
  ShoppingCart,
  ShoppingCartItem
} from './shoppingcart'
import {PackagingType} from '../products/product'
import {toData} from '../../conversion'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {UUID} from '../../types'
import {PRODUCT_CREATED} from '../products/product_messages'
import {
  ADD_ITEM_TO_SHOPPING_CART,
  CHECK_OUT_SHOPPING_CART,
  CREATE_SHOPPING_CART,
  REMOVE_ITEM_FROM_SHOPPING_CART,
  SHOPPING_CART_CHECKED_OUT,
  SHOPPING_CART_CREATED,
  SHOPPING_CART_ITEM_ADDED,
  SHOPPING_CART_ITEM_REMOVED
} from './shoppingcart_messages'
import {Global} from '../../global'
import {Event} from '../../eventbus'
import {ProductsReadModel} from './products_readmodel'
let objectContaining = jasmine.objectContaining


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
  let events: Event[]
  beforeEach(() => {
    events = []
    productsReadModel = new ProductsReadModel()
    repository = new ShoppingCartRepositoryInMemory()
    fixture = new ShoppingCartFixture(repository, productsReadModel)
  })
  describe('when creating an empty Shopping Cart', () => {
    let id: UUID
    beforeEach(async () => {
      id = await new Promise<UUID>(resolve => {
        eventbus.subscribe('*', ev => events.push(ev))
        eventbus.subscribeOnce(SHOPPING_CART_CREATED, ev =>
          resolve(ev.payload.id))
        eventbus.dispatch({type: CREATE_SHOPPING_CART, payload: []})
      })
    })

    it('should return the cart\'s ID', () => {
      expect(id).toBeDefined()
    })

    it('should store the cart in repository', () => {
      expect(repository.getById(id)).toBeDefined()
    })

    it(`should dispatch ${SHOPPING_CART_CREATED}`, () => {
      expect(events).toContainEqual(objectContaining({type: SHOPPING_CART_CREATED}))
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

        it('should update the cart in repository', () => {
          expect(repository.getById(id).items).toContainEqual(ITEM)
        })

        it(`should dispatch ${SHOPPING_CART_ITEM_ADDED}`, () => {
          expect(events).toContainEqual(objectContaining({type: SHOPPING_CART_ITEM_ADDED}))
        })
      })

      describe('when the item is invalid', () => {
        it('should throw', () => {
          expect(() => Global.eventbus.dispatch({
            type: ADD_ITEM_TO_SHOPPING_CART,
            payload: {id, item: {...itemData, name: 'invalid name'}}
          })).toThrow()
        })

        it('should not update the cart in repository', () => {
          expect(repository.getById(id).items).not.toContainEqual(ITEM)
        })

        it(`should not dispatch ${SHOPPING_CART_ITEM_ADDED}`, () => {
          try {
            Global.eventbus.dispatch({
              type: ADD_ITEM_TO_SHOPPING_CART,
              payload: {id, item: {...itemData, name: 'invalid name'}}
            })
          } catch (_) {
          }
          expect(events).not.toContainEqual(objectContaining({type: SHOPPING_CART_ITEM_ADDED}))
        })
      })

      describe('when the cart is unknown', () => {
        it('should throw', () => {
          expect(() => Global.eventbus.dispatch({
            type: ADD_ITEM_TO_SHOPPING_CART,
            payload: {id: 'unknown', item: itemData}
          })).toThrow()
        })

        it(`should not dispatch ${SHOPPING_CART_ITEM_ADDED}`, () => {
          try {
            Global.eventbus.dispatch({type: ADD_ITEM_TO_SHOPPING_CART, payload: {id: 'unknown', item: itemData}})
          } catch (_) {
          }
          expect(events).not.toContainEqual(objectContaining({type: SHOPPING_CART_ITEM_ADDED}))
        })
      })
    })
  })

  describe('when a loaded ShoppingCart exists', () => {

    beforeEach(() => {
      const cart = ShoppingCart.restore('1', [ITEM])
      repository.create(cart)
      const cartData: ShoppingCartData = toData(cart)
      eventbus.subscribe('*', ev => events.push(ev))
      eventbus.dispatch({type: SHOPPING_CART_CREATED, payload: cartData})
      eventbus.dispatch({type: SHOPPING_CART_ITEM_ADDED, payload: cartData})
    })

    describe('and the cart is checked out', () => {
      beforeEach(async () => {
        await new Promise<UUID>(resolve => {
          eventbus.subscribeOnce(SHOPPING_CART_CHECKED_OUT, () =>
            resolve())
          eventbus.dispatch({type: CHECK_OUT_SHOPPING_CART, payload: '1'})
        })
      })

      it('should remove the cart from the repository', () => {
        expect(repository.findById('1')).toBeUndefined()
      })

      it(`should dispatch ${SHOPPING_CART_CHECKED_OUT}`, () => {
        expect(events).toContainEqual(objectContaining({type: SHOPPING_CART_CHECKED_OUT}))
      })
    })

    it('should throw when trying to check out unknown ShoppingCart', () => {
      expect(() => Global.eventbus.dispatch({type: CHECK_OUT_SHOPPING_CART, payload: 'unknown'})).toThrow()
    })


    describe('and removing the only existing item', () => {
      beforeEach(() => {
        Global.eventbus.dispatch({type: REMOVE_ITEM_FROM_SHOPPING_CART, payload: {id: '1', item: toData(ITEM)}})
      })

      it('should update the cart in repository', () => {
        expect(repository.getById('1').items).not.toContainEqual(ITEM)
      })

      it(`should dispatch ${SHOPPING_CART_ITEM_REMOVED}`, () => {
        expect(events).toContainEqual(objectContaining({type: SHOPPING_CART_ITEM_REMOVED}))
      })
    })

    it('should ignore when trying to remove a non-existing item', () => {
      const data: ShoppingCartItemData = toData(ITEM)
      const unknownItem = {...data, id: '0', name: 'unknown item'}
      eventbus.dispatch({type: REMOVE_ITEM_FROM_SHOPPING_CART, payload: {id: '1', item: unknownItem}})
      expect(events).not.toContainEqual(objectContaining({type: SHOPPING_CART_ITEM_REMOVED}))

    })

    it('should throw when trying to remove an item from an unknown ShoppingCart', () => {
      expect(() =>
        eventbus.dispatch({
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
