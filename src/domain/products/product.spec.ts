import {
  PackagingType,
  Product
} from './product'

describe('Product', () => {
  it('should convert from serialized data', () => {
    expect(Product.fromData({
      id:'1',
      name: 'Whole Milk',
      packagingType: PackagingType.CARTON,
      amount: '1L',
      price: '1.19 EUR'
    })).toBeDefined()
  })
})
