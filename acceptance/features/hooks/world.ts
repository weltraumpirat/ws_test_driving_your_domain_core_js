import {setWorldConstructor} from 'cucumber'
import {
  ShoppingCartsApi
} from '../../../src/api/shoppingcarts_api'
import {
  ProductsApi
} from '../../../src/api/products_api'
import {UUID} from '../../../src/types'
import {CheckoutService} from '../../../src/domain/checkoutservice'
import {ShoppingCartRepositoryInMemory} from '../../../src/persistence/shoppingcart_repository'
import {ShoppingCartRepository} from '../../../src/domain/shoppingcart'
import {ShoppingCartFixture} from '../../../src/domain/shoppingcart_fixture'
import {ProductRepositoryInMemory} from '../../../src/persistence/product_repository'
import {
  ProductFixture,
  ProductRepository
} from '../../../src/domain/product_fixture'
import {
  OrdersApi
} from '../../../src/api/orders_api'
import {ProductsReadModel} from '../../../src/domain/products_readmodel'
import {ShoppingCartsReadModel} from '../../../src/domain/shoppingcarts_readmodel'
import {OrdersReadModel} from '../../../src/domain/orders_readmodel'

class World {
  public productsApi: ProductsApi
  public productFixture: ProductFixture
  public productsReadModel: ProductsReadModel
  public productRepository: ProductRepository
  public shoppingCartFixture: ShoppingCartFixture
  public shoppingCartApi: ShoppingCartsApi
  public shoppingCartRepository: ShoppingCartRepository
  public shoppingCartsReadModel: ShoppingCartsReadModel
  public checkoutService: CheckoutService
  public ordersApi: OrdersApi
  public ordersReadModel: OrdersReadModel

  // noinspection JSUnusedGlobalSymbols
  public cartId?: UUID


  public constructor() {
    this.productRepository = new ProductRepositoryInMemory()
    this.productsReadModel = new ProductsReadModel()
    this.productFixture = new ProductFixture(this.productRepository, this.productsReadModel)
    this.productsApi = new ProductsApi(this.productFixture, this.productsReadModel)

    this.shoppingCartRepository = new ShoppingCartRepositoryInMemory()
    this.shoppingCartsReadModel = new ShoppingCartsReadModel()
    this.ordersReadModel = new OrdersReadModel()
    this.ordersApi = new OrdersApi(this.ordersReadModel)
    this.checkoutService = new CheckoutService(this.ordersApi)
    this.shoppingCartFixture = new ShoppingCartFixture(
      this.shoppingCartRepository,
      this.shoppingCartsReadModel,
      this.productsReadModel,
      this.checkoutService)
    this.shoppingCartApi = new ShoppingCartsApi(this.shoppingCartFixture)
  }
}

setWorldConstructor(World)
