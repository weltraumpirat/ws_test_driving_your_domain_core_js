import {Global} from '../../global'
import {ProductsReadModel} from './products_readmodel'
import {ProductData} from '../../api/products_api'
import {PackagingType} from '../products/product'
import {PRODUCT_CREATED} from './external_messages'

const eventbus = Global.eventbus
describe('ProductsReadModel', () => {
  let productsReadModel: ProductsReadModel
  beforeEach(() => {
    productsReadModel = new ProductsReadModel()
  })

  describe('when creating a new product', () => {
    beforeEach(() => {
      const product: ProductData = {
        id: '1',
        name: 'Whole Milk',
        packagingType: PackagingType.CARTON,
        amount: '1l', price:
          '1.19 EUR'
      }
      eventbus.dispatch({type: PRODUCT_CREATED, payload: product})
    })
    it('should return list of one product', () => {
      expect(productsReadModel.getProducts()).toHaveLength(1)
    })
  })
})
