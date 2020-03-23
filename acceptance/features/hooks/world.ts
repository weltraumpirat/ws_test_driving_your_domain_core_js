import {setWorldConstructor} from 'cucumber'
import {
  ShoppingCartApi
} from '../../../src/api/shoppingcart_api'
import {ProductCatalogApi} from '../../../src/api/productcatalog_api'
import {UUID} from '../../../src/types'
import {CheckoutService} from '../../../src/domain/checkoutservice'
import {ShoppingCartRepositoryInMemory} from '../../../src/persistence/shoppingcart_repository'
import {ShoppingCartRepository} from '../../../src/domain/shoppingcart'

class World {
  public productCatalogApi: ProductCatalogApi
  public shoppingCartApi: ShoppingCartApi
  public shoppingCartRepository: ShoppingCartRepository
  public checkoutService: CheckoutService
  // noinspection JSUnusedGlobalSymbols
  public cartId?: UUID


  public constructor() {
    this.productCatalogApi = new ProductCatalogApi()
    this.shoppingCartRepository = new ShoppingCartRepositoryInMemory()
    this.checkoutService = new CheckoutService()
    this.shoppingCartApi = new ShoppingCartApi(
      this.shoppingCartRepository,
      this.productCatalogApi,
      this.checkoutService)
  }
}

setWorldConstructor(World)
