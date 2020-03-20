import {
  ShoppingCart,
  ShoppingCartItem
} from './shoppingcart'
import {PackagingType} from './product'

describe('Shopping Cart:', () => {
  let item: ShoppingCartItem
  let cart: ShoppingCart

  beforeEach(() => {
    cart = ShoppingCart.createEmpty()
    item = ShoppingCartItem.create('Whole Milk', 'Carton', '1l', '1.19 EUR')
  })

  it('should be empty', () => {
    expect(ShoppingCart.createEmpty().empty).toBe(true)
  })

  it('should contain one item after adding one', () => {
    cart.addItem(item)
    expect(cart.empty).toBe(false)
    expect(cart.items).toHaveLength(1)
    expect(cart.items[0].name).toEqual(item.name)
  })

  describe('when it contains one item', () => {
    beforeEach(() => {
      cart = ShoppingCart.createWithItems(item)
    })

    it('should be empty after removing one', () => {
      cart.removeItem(item)
      expect(cart.empty).toBe(true)
    })
  })

  it('should convert from serialized data', () => {
    expect(ShoppingCartItem.fromData({
      id: '1',
      name: 'Whole Milk',
      packagingType: PackagingType.CARTON,
      amount: '1L',
      price: '1.19 EUR'
    }).label).toEqual('Whole Milk, 1L Carton')
  })
})
