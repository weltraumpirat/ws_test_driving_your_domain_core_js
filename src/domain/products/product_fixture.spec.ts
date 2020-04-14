import {ProductFixture} from './product_fixture'
import {
  PackagingType
} from './product'
import {ProductRepositoryInMemory} from '../../persistence/product_repository'
import {ProductsReadModel} from './products_readmodel'
import {expectEqualData} from '../../comparison'
import {
  ADD_PRODUCT,
  ADD_PRODUCTS
} from './product_messages'
import {Global} from '../../global'

describe('ProductFixture', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let catalog: ProductFixture
  let readModel: ProductsReadModel
  const product = {id: '1', name: 'Product', packagingType: PackagingType.PACK, amount: '10', price: '1.00 EUR'}

  describe('when created', () => {
    beforeEach(() => {
      readModel = new ProductsReadModel()
      catalog = new ProductFixture(new ProductRepositoryInMemory())
    })

    it('should be empty', () => {
      expect(readModel.products).toHaveLength(0)
    })

    it('should store a new product', () => {
      Global.eventbus.dispatch({type: ADD_PRODUCT, payload: product})
      expect(readModel.products).toHaveLength(1)
      expectEqualData(readModel.products[0], product)
    })

    it('should store a list of previously created products', () => {
      Global.eventbus.dispatch({type: ADD_PRODUCTS, payload: [product]})
      expect(readModel.products).toHaveLength(1)
      expectEqualData(readModel.products[0], product)
    })

    afterEach(() => {
      Global.eventbus.release()
    })
  })
})
