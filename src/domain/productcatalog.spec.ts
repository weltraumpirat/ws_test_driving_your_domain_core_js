import {ProductCatalog} from './productcatalog'
import {
  PackagingType,
  Product
} from './product'
import {ProductRepositoryInMemory} from '../persistence/product_repository'

describe('ProductCatalog', () => {
  let catalog: ProductCatalog
  describe('when created', () => {
    beforeEach(() => {
      catalog = ProductCatalog.create(new ProductRepositoryInMemory())
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

    describe('and an initial set of products is provided', () => {
      beforeEach(() => {
        catalog = ProductCatalog.create(new ProductRepositoryInMemory([{
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
