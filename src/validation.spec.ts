import {
  PackagingType,
  Product
} from './domain/products/product'
import {ShoppingCartItem} from './domain/shoppingcarts/shoppingcart'
import {validateShoppingCartItem} from './validation'

describe('validateShoppingCartItem', () => {
  const product = new Product('1', 'Product', PackagingType.PACK, '10', '1.00 EUR')

  const expectValid = (item: Partial<ShoppingCartItem>): void => {
    expect(() => validateShoppingCartItem(item as ShoppingCartItem, [product])).not.toThrow()
  }
  const expectInvalid = (item: Partial<ShoppingCartItem>): void => {
    expect(() => validateShoppingCartItem(item as ShoppingCartItem, [product])).toThrow()
  }

  it('should not throw an error if an added ShoppingCartItem is a valid product', () => {
    expectValid({id: '1', name: 'Product', packagingType: PackagingType.PACK, amount: '10', price: '1.00 EUR'})
  })

  it('should throw an error if an added ShoppingCartItem is not a valid product', () => {
    expectInvalid({id: undefined, name: 'Product', packagingType: PackagingType.PACK, amount: '10', price: '1.00 EUR'})
    expectInvalid({
      id: '1',
      name: 'Another Product',
      packagingType: PackagingType.PACK,
      amount: '10',
      price: '1.00 EUR'
    })
    expectInvalid({id: '1', name: 'Product', packagingType: PackagingType.LOAF, amount: '10', price: '1.00 EUR'})
    expectInvalid({id: '1', name: 'Product', packagingType: PackagingType.PACK, amount: '1L', price: '1.00 EUR'})
    expectInvalid({id: '1', name: 'Product', packagingType: PackagingType.PACK, amount: '10', price: '1.01 EUR'})
  })
})
