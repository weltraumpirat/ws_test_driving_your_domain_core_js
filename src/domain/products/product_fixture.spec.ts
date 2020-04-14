import {ProductFixture} from './product_fixture'
import {PackagingType} from './product'
import {ProductRepositoryInMemory} from '../../persistence/product_repository'
import {expectEqualData} from '../../comparison'
import {
  ADD_PRODUCT,
  ADD_PRODUCTS
} from './product_messages'
import {Global} from '../../global'
import {ensure} from '../../types'

describe('ProductFixture', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let catalog: ProductFixture
  let repository: ProductRepositoryInMemory
  const product = {id: '1', name: 'Product', packagingType: PackagingType.PACK, amount: '10', price: '1.00 EUR'}

  describe('when created', () => {
    beforeEach(() => {
      repository = new ProductRepositoryInMemory()
      catalog = new ProductFixture(repository)
    })

    it('should be empty', () => {
      expect(repository.findAll()).toHaveLength(0)
    })

    it('should store a new product', () => {
      Global.eventbus.dispatch({type: ADD_PRODUCT, payload: product})
      expect(repository.findAll()).toHaveLength(1)
      expectEqualData(ensure(repository.findById('1')), product)
    })

    it('should store a list of previously created products', () => {
      Global.eventbus.dispatch({type: ADD_PRODUCTS, payload: [product]})
      expect(repository.findAll()).toHaveLength(1)
      expectEqualData(ensure(repository.findById('1')), product)
    })

    afterEach(() => {
      Global.eventbus.release()
    })
  })
})
