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

  it('should create an empty ShoppingCart', () => {
    expect(fixture.createShoppingCart([])).toBeDefined()
  })

  describe('when an empty ShoppingCart exists', () => {
    beforeEach(() => {
      const cart = ShoppingCart.restore('1')
      repository.create(cart)
      const cartData: ShoppingCartData = toData(cart)
      itemsReadModel.notifyCartCreated(cartData)
      emptyReadModel.notifyCartCreated(cartData)
    })

    it('should return if that ShoppingCart is empty', () => {
      expect(fixture.isShoppingCartEmpty('1'))
    })

    it('should return false when querying if unknown ShoppingCart is empty', () => {
      expect(fixture.isShoppingCartEmpty('unknown')).toBe(false)
    })

    describe('and an item is added', () => {
      let itemData: ShoppingCartItemData
      beforeEach(() => {
        itemData = toData(ITEM)
        // @ts-ignore
        // noinspection JSConstantReassignment
        productsReadModel.products = [itemData as ProductData]
      })

      it('should add a valid item', () => {
        fixture.addItemToShoppingCart('1', itemData)
        expect(fixture.getShoppingCartItems('1')).toEqual([itemData])
      })

      it('should throw when item is invalid', () => {
        expect(() => fixture.addItemToShoppingCart('1', {...itemData, name: 'invalid name'})).toThrow()
      })
      it('should throw when ShoppingCart is unknown', () => {
        expect(() => fixture.addItemToShoppingCart('unknown', {...itemData, name: 'invalid name'})).toThrow()
      })
    })
  })

  describe('when a loaded ShoppingCart exists', () => {
    beforeEach(()=>{
      const cart = ShoppingCart.restore('1', [ITEM])
      repository.create(cart)
      const cartData: ShoppingCartData = toData(cart)
      itemsReadModel.notifyCartCreated(cartData)
      itemsReadModel.notifyItemAdded(cartData)
      emptyReadModel.notifyCartCreated(cartData)
      emptyReadModel.notifyItemAdded(cartData)
    })

    it('should return the ShoppingCart\'s items', () => {
      expect(fixture.getShoppingCartItems('1')).toEqual([ITEM])
    })

    it('should throw when querying unknown ShoppingCart items', () => {
      expect(() => fixture.getShoppingCartItems('unknown')).toThrow()
    })

    it('should check out the ShoppingCart', () => {
      fixture.checkOut('1')
      expect(checkoutService.checkOut).toHaveBeenCalledWith(jasmine.arrayContaining([toData(ITEM)]))
    })

    it('should throw when trying to check out unknown ShoppingCart', () => {
      expect(() => fixture.checkOut('unknown')).toThrow()
      expect(checkoutService.checkOut).not.toHaveBeenCalled()
    })

    it('should remove an existing item', () => {
      fixture.removeItemFromShoppingCart('1', toData(ITEM))
      expect(fixture.isShoppingCartEmpty('1')).toBe(true)
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
