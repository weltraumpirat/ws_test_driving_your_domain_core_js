import {setWorldConstructor} from 'cucumber'
import {Product} from '../../../src/domain/product'
import {ShoppingCartApi} from '../../../src/api/shoppingcart_api'
import {ProductCatalogApi} from '../../../src/api/productcatalog_api'

class World {
  public products: Product[]
  public productCatalogApi: ProductCatalogApi
  public shoppingCartApi: ShoppingCartApi

  public constructor() {
    this.products = []
    this.productCatalogApi = new ProductCatalogApi()
    this.shoppingCartApi = new ShoppingCartApi(this.productCatalogApi)
  }
}

setWorldConstructor(World)
