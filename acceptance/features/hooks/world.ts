import {setWorldConstructor} from 'cucumber'
import {
  ShoppingCartsApi
} from '../../../src/api/shoppingcarts_api'
import {
  ProductsApi,
  ProductsReadModel
} from '../../../src/api/products_api'
import {UUID} from '../../../src/types'
import {CheckoutService} from '../../../src/domain/checkoutservice'
import {ShoppingCartRepositoryInMemory} from '../../../src/persistence/shoppingcart_repository'
import {ShoppingCartRepository} from '../../../src/domain/shoppingcart'
import {ShoppingCartFixture} from '../../../src/domain/shoppingcart_fixture'
import {ProductRepositoryInMemory} from '../../../src/persistence/product_repository'
import {Product} from '../../../src/domain/product'
import {
  ProductFixture,
  ProductRepository
} from '../../../src/domain/product_fixture'

class World {
  public productsApi: ProductsApi
  public productFixture: ProductFixture
  public productsReadModel: ProductsReadModel
  public productRepository: ProductRepository
  public shoppingCartFixture: ShoppingCartFixture
  public shoppingCartApi: ShoppingCartsApi
  public shoppingCartRepository: ShoppingCartRepository
  public checkoutService: CheckoutService
  // noinspection JSUnusedGlobalSymbols
  public cartId?: UUID




  public constructor() {
    this.productRepository = new ProductRepositoryInMemory()
    this.productsReadModel = new ProductsReadModel()
    this.productFixture = new ProductFixture(this.productRepository, this.productsReadModel)
    this.productsApi = new ProductsApi(this.productFixture, this.productsReadModel)

    this.shoppingCartRepository = new ShoppingCartRepositoryInMemory()
    this.checkoutService = new CheckoutService()
    this.shoppingCartFixture = new ShoppingCartFixture(
      this.shoppingCartRepository,
      this.productsApi,
      this.checkoutService)
    this.shoppingCartApi = new ShoppingCartsApi(this.shoppingCartFixture)
  }
}

setWorldConstructor(World)
