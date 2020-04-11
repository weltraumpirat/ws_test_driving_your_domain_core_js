import {
  ShoppingCartData,
  ShoppingCartFixture
} from './shoppingcart_fixture'
import {ShoppingCartRepositoryInMemory} from '../../persistence/shoppingcart_repository'
import {ProductData} from '../../api/products_api'
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


jest.mock('../../api/products_api')
jest.mock('../../api/orders_api')
jest.mock('../checkout/checkoutservice')

const ITEM = ShoppingCartItem.fromData(
  {
    id: '1',
    name: 'Whole Milk',
    packagingType: PackagingType.CARTON,
    amount: '1L',
    price: '1.19 EUR'
  }
)
describe('ShoppingCartFixture', () => {
  let fixture: ShoppingCartFixture
  let productsReadModel: ProductsReadModel
  let repository: ShoppingCartRepositoryInMemory
  let itemsReadModel: ShoppingCartItemsReadModel
  let emptyReadModel: ShoppingCartEmptyReadModel
  let checkoutService: CheckoutService
  beforeEach(() => {
    productsReadModel = new ProductsReadModel()
    repository = new ShoppingCartRepositoryInMemory()
    itemsReadModel = new ShoppingCartItemsReadModel()
    emptyReadModel = new ShoppingCartEmptyReadModel()
    checkoutService = new CheckoutService(new OrdersApi(new OrdersReadModel()))
    fixture = new ShoppingCartFixture(repository, itemsReadModel, emptyReadModel, productsReadModel, checkoutService)
  })
  describe('when creating an empty Shopping Cart', () => {
    let id: UUID
    beforeEach(() => {
      id = fixture.createShoppingCart([])
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

    it('should also consider an unknown cart empty', () => {
      expect(fixture.isShoppingCartEmpty('unknown')).toBe(false)
    })

    it('should return no items for the cart', () => {
      expect(itemsReadModel.getItems(id)).toEqual([])
    })

    it('should throw when querying unknown ShoppingCart items', () => {
      expect(() => fixture.getShoppingCartItems('unknown')).toThrow()
    })

    describe('and an item is added', () => {
      let itemData: ShoppingCartItemData
      beforeEach(() => {
        itemData = toData(ITEM)
        // @ts-ignore
        // noinspection JSConstantReassignment
        productsReadModel.products = [itemData as ProductData]
      })

      describe('when the item is valid', () => {
        beforeEach(() => {
          fixture.addItemToShoppingCart(id, itemData)
        })
        it('should store the item', () => {
          expect(itemsReadModel.getItems(id)).toEqual([itemData])
        })
        it('should no longer consider the cart empty', () => {
          expect(emptyReadModel.isEmpty(id)).toBe(false)
        })
      })

      describe('when the item is invalid', () => {
        it('should throw', () => {
          expect(() => fixture.addItemToShoppingCart(id, {...itemData, name: 'invalid name'})).toThrow()
        })

        it('should not apply changes', () => {
          try {
            fixture.addItemToShoppingCart(id, {...itemData, name: 'invalid name'})
          } catch (_) {
          }
          expect(itemsReadModel.getItems(id)).toEqual([])
          expect(emptyReadModel.isEmpty(id)).toBe(true)
        })
      })

      describe('when the cart is unknown', () => {
        it('should throw', () => {
          expect(() => fixture.addItemToShoppingCart('unknown', {...itemData, name: 'invalid name'})).toThrow()
        })
        it('should not apply changes', () => {
          try {
            fixture.addItemToShoppingCart('unknown', {...itemData, name: 'invalid name'})
          } catch (_) {
          }
          expect(itemsReadModel.getItems(id)).toEqual([])
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
      itemsReadModel.notifyCartCreated(cartData)
      itemsReadModel.notifyItemAdded(cartData)
      emptyReadModel.notifyCartCreated(cartData)
      emptyReadModel.notifyItemAdded(cartData)
    })

    describe('and the cart is checked out', () => {
      beforeEach(() => {
        fixture.checkOut('1')
      })
      it('should forward to checkout service', () => {
        expect(checkoutService.checkOut).toHaveBeenCalledWith(jasmine.arrayContaining([toData(ITEM)]))
      })
      it('should not consider the cart empty', () => {
        expect(emptyReadModel.isEmpty('1')).toBe(false)
      })
      it('should throw when querying items', () => {
        expect(() => itemsReadModel.getItems('1')).toThrow()
      })
    })

    it('should throw when trying to check out unknown ShoppingCart', () => {
      expect(() => fixture.checkOut('unknown')).toThrow()
      expect(checkoutService.checkOut).not.toHaveBeenCalled()
    })


    describe('and removing the only existing item', () => {
      beforeEach(() => {
        fixture.removeItemFromShoppingCart('1', toData(ITEM))
      })

      it('should be empty', () => {
        expect(emptyReadModel.isEmpty('1')).toBe(true)
      })

      it('should return no items', () => {
        expect(itemsReadModel.getItems('1')).toEqual([])
      })
    })

    it('should ignore when trying to remove a non-existing item', () => {
      const data: ShoppingCartItemData = toData(ITEM)
      const unknownItem = {...data, id: '0', name: 'unknown item'}
      fixture.removeItemFromShoppingCart('1', unknownItem)
      expect(fixture.isShoppingCartEmpty('1')).toBe(false)
    })

    it('should throw when trying to remove an item from an unknown ShoppingCart', () => {
      expect(() => fixture.removeItemFromShoppingCart('unknown', toData(ITEM))).toThrow()
    })
  })
})
