import {ProductFixture} from './product_fixture'
import {
  PackagingType,
  Product
} from './product'
import {ProductRepositoryInMemory} from '../persistence/product_repository'

describe('ProductFixture', () => {
  let catalog: ProductFixture
  describe('when created', () => {
    beforeEach(() => {
      catalog = new ProductFixture(new ProductRepositoryInMemory())
    })

    it('should be empty', () => {
      expect(catalog.products).toHaveLength(0)
    })

    it('should store a new product', () => {
      const product = Product.create('Product', PackagingType.PACK, '10', '1.00 EUR')
      catalog.addProduct(product)
      expect(catalog.products).toHaveLength(1)
      expect(catalog.products[0]).toEqual(product)
    })

    it('should store a list of new products', () => {
      const product = Product.create('Product', PackagingType.PACK, '10', '1.00 EUR')
      catalog.addProducts([product])
      expect(catalog.products).toHaveLength(1)
      expect(catalog.products[0]).toEqual(product)
    })

    describe('and an initial set of products is provided', () => {
      beforeEach(() => {
        catalog = new ProductFixture(new ProductRepositoryInMemory([{
          id: '1',
          name: 'Product',
          packagingType: PackagingType.PACK,
          amount: '10',
          price: '1.00 EUR'
        }]))
      })

      it('should not be empty', () => {
        expect(catalog.products).toHaveLength(1)
      })
    })
  })
})
