import {CheckoutService} from './CheckoutService'
import {Order} from './Order'
import {equalOrderIgnoringIds} from '../comparison'

describe('CheckoutService:', () => {
  it('should create an empty Order from zero shopping cart items', () => {
    expect(equalOrderIgnoringIds(new CheckoutService().checkOut([]), Order.create())).toBe(true)
  })

  it('should create an Order with a single position from one shopping cart item', () => {
    expect(equalOrderIgnoringIds(new CheckoutService().checkOut([]), {
      id: '1',
      total: '0 EUR',
      positions: []
    })).toBe(true)
    expect(equalOrderIgnoringIds(new CheckoutService().checkOut([{
      id: '1', name: 'Whole Milk', packagingType: 'Carton', amount: '1l', price: '1.19 EUR'
    }]), {
      id: '1', total: '1.19 EUR', positions: [{
        id: '1', itemName: 'Whole Milk, 1l Carton', count: 1, singlePrice: '1.19 EUR', combinedPrice: '1.19 EUR'
      }]
    })).toBe(true)
  })
})
