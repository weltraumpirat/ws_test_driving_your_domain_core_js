import {ShoppingCartFixture} from './shoppingcart_fixture'
import {ShoppingCartRepositoryInMemory} from '../persistence/shoppingcart_repository'
import {
  ProductData,
  ProductsApi
} from '../api/products_api'
import {CheckoutService} from './checkoutservice'
import {
  ShoppingCart,
  ShoppingCartItem
} from './shoppingcart'
import {PackagingType} from './product'
import {toData} from '../conversion'
import {ShoppingCartItemData} from '../api/shoppingcarts_api'


jest.mock('../api/products_api')
jest.mock('./checkoutservice')

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
  beforeEach(() => {
    // @ts-ignore
    fixture = new ShoppingCartFixture(new ShoppingCartRepositoryInMemory(), new ProductsApi(), new CheckoutService())
  })

  it('should create an empty ShoppingCart', () => {
    expect(fixture.createShoppingCart([])).toBeDefined()
  })

  describe('when an empty ShoppingCart exists', () => {
    let productsApi: ProductsApi
    beforeEach(() => {
      // @ts-ignore
      productsApi = new ProductsApi()
      fixture = new ShoppingCartFixture(
        new ShoppingCartRepositoryInMemory([ShoppingCart.restore('1')]),
        productsApi,
        new CheckoutService())
    })

    it('should return if that ShoppingCart is empty', () => {
      expect(fixture.isShoppingCartEmpty('1'))
    })

    it('should throw when querying if unknown ShoppingCart is empty', () => {
      expect(() => fixture.isShoppingCartEmpty('unknown')).toThrow()
    })

    describe('and an item is added', () => {
      let itemData: ShoppingCartItemData
      beforeEach(() => {
        itemData = toData(ITEM)
        productsApi.getProducts = jest.fn(() => [itemData as ProductData])
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
    let checkoutService: CheckoutService
    beforeEach(() => {

      checkoutService = new CheckoutService()
      fixture = new ShoppingCartFixture(
        new ShoppingCartRepositoryInMemory([ShoppingCart.restore('1', [ITEM])]),
        // @ts-ignore
        new ProductsApi(),
        checkoutService)
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
      expect(()=>fixture.removeItemFromShoppingCart('unknown', toData(ITEM))).toThrow()
    })
  })
})
