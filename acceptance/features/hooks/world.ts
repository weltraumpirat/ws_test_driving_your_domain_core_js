import {setWorldConstructor} from 'cucumber'
import {ShoppingCartApi} from '../../../src/api/shoppingcart_api'
import {ProductCatalogApi} from '../../../src/api/productcatalog_api'
import {UUID} from '../../../src/types'

class World {
  public productCatalogApi: ProductCatalogApi
  public shoppingCartApi: ShoppingCartApi
  public cartId?: UUID

  public constructor() {
    this.productCatalogApi = new ProductCatalogApi()
    this.shoppingCartApi = new ShoppingCartApi(this.productCatalogApi)
  }
}

setWorldConstructor(World)
