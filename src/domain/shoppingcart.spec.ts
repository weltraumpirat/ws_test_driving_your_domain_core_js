import {
  ShoppingCart,
  ShoppingCartItem
} from './ShoppingCart'

describe('Shopping Cart:', () => {
  let item: ShoppingCartItem
  let cart: ShoppingCart

  beforeEach(() => {
    cart = ShoppingCart.createEmpty()
    item = ShoppingCartItem.create( 'Whole Milk','Carton',  '1l',  '1.19 EUR')

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
})
