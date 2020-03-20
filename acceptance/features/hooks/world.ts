import {setWorldConstructor} from 'cucumber'
import {ShoppingCartApi} from '../../../src/api/shoppingcart_api'
import {ProductCatalogApi} from '../../../src/api/productcatalog_api'

class World {
  public productCatalogApi: ProductCatalogApi
  public shoppingCartApi: ShoppingCartApi

  public constructor() {
    this.productCatalogApi = new ProductCatalogApi()
    this.shoppingCartApi = new ShoppingCartApi(this.productCatalogApi)
  }
}

setWorldConstructor(World)
