import {ProductFixture} from './product_fixture'
import {
  PackagingType,
  Product
} from './product'
import {ProductRepositoryInMemory} from '../../persistence/product_repository'
import {ProductsReadModel} from './products_readmodel'
import {expectEqualData} from '../../comparison'

describe('ProductFixture', () => {
  let catalog: ProductFixture
  let readModel: ProductsReadModel
  describe('when created', () => {
    beforeEach(() => {
      readModel = new ProductsReadModel()
      catalog = new ProductFixture(new ProductRepositoryInMemory(), readModel)
    })

    it('should be empty', () => {
      expect(readModel.products).toHaveLength(0)
    })

    it('should store a new product', () => {
      const product = Product.create('Product', PackagingType.PACK, '10', '1.00 EUR')
      catalog.addProduct(product)
      expect(readModel.products).toHaveLength(1)
      expectEqualData(readModel.products[0], product)
    })

    it('should store a list of new products', () => {
      const product = Product.create('Product', PackagingType.PACK, '10', '1.00 EUR')
      catalog.addProducts([product])
      expect(readModel.products).toHaveLength(1)
      expectEqualData(readModel.products[0], product)
    })
  })
})
