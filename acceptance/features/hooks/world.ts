import {setWorldConstructor} from 'cucumber'
import {
  ShoppingCartApi
} from '../../../src/api/shoppingcart_api'
import {ProductCatalogApi} from '../../../src/api/productcatalog_api'
import {UUID} from '../../../src/types'
import {CheckoutService} from '../../../src/domain/checkoutservice'
import {ShoppingCartRepositoryInMemory} from '../../../src/persistence/shoppingcart_repository'

class World {
  public productCatalogApi: ProductCatalogApi
  public shoppingCartApi: ShoppingCartApi
  // noinspection JSUnusedGlobalSymbols
  public cartId?: UUID

  public constructor() {
    this.productCatalogApi = new ProductCatalogApi()
    this.shoppingCartApi = new ShoppingCartApi(new ShoppingCartRepositoryInMemory(), this.productCatalogApi, new CheckoutService())
  }
}

setWorldConstructor(World)
