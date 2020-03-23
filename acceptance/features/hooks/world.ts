import {setWorldConstructor} from 'cucumber'
import {
  ShoppingCartsApi
} from '../../../src/api/shoppingcarts_api'
import {ProductsApi} from '../../../src/api/products_api'
import {UUID} from '../../../src/types'
import {CheckoutService} from '../../../src/domain/checkoutservice'
import {ShoppingCartRepositoryInMemory} from '../../../src/persistence/shoppingcart_repository'
import {ShoppingCartRepository} from '../../../src/domain/shoppingcart'
import {ShoppingCartFixture} from '../../../src/domain/shoppingcart_fixture'

class World {
  public productCatalogApi: ProductsApi
  public shoppingCartFixture: ShoppingCartFixture
  public shoppingCartApi: ShoppingCartsApi
  public shoppingCartRepository: ShoppingCartRepository
  public checkoutService: CheckoutService
  // noinspection JSUnusedGlobalSymbols
  public cartId?: UUID


  public constructor() {
    this.productCatalogApi = new ProductsApi()
    this.shoppingCartRepository = new ShoppingCartRepositoryInMemory()
    this.checkoutService = new CheckoutService()
    this.shoppingCartFixture = new ShoppingCartFixture(
      this.shoppingCartRepository,
      this.productCatalogApi,
      this.checkoutService)
    this.shoppingCartApi = new ShoppingCartsApi(this.shoppingCartFixture)

  }
}

setWorldConstructor(World)
