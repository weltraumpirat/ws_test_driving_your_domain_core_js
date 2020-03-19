import {CheckoutService} from './checkoutservice'
import {Order} from './order'
import {equalOrderIgnoringIds} from '../comparison'

describe('CheckoutService:', () => {
  it('should create an empty Order from zero shopping cart items', () => {
    const expectedOrder = {
      id: '1',
      total: '0 EUR',
      positions: []
    }
    expect(equalOrderIgnoringIds(new CheckoutService().checkOut([]), expectedOrder)).toBe(true)
  })

  it('should create an Order with a single position from one shopping cart item', () => {
    const item = {
      id: '1',
      name: 'Whole Milk',
      packagingType: 'Carton',
      amount: '1l',
      label: 'Whole Milk, 1l Carton',
      price: '1.19 EUR'
    }
    const expectedOrder = {
      id: '1',
      total: '1.19 EUR',
      positions: [{
        id: '1',
        itemName: 'Whole Milk, 1l Carton',
        count: 1,
        singlePrice: '1.19 EUR',
        combinedPrice: '1.19 EUR'
      }]
    }
    expect(equalOrderIgnoringIds(new CheckoutService().checkOut([item]), expectedOrder))
      .toBe(true)
  })
})
