import {Product} from './product'
import {ProductData} from '../../api/products_api'
import {toData} from '../../conversion'
import {ProductsReadModel} from './products_readmodel'
import {AggregateFixture} from '../aggregate'
import {Command} from '../../eventbus'
import {
  ADD_PRODUCT,
  ADD_PRODUCTS,
  PRODUCT_CREATED
} from './product_messages'

export interface ProductRepository {
  findAll(): Product[]

  create(product: Product): void
}

export class ProductFixture implements AggregateFixture {
  private _repository: ProductRepository
  private _productReadModel: ProductsReadModel

  public constructor(repository: ProductRepository, productReadModel: ProductsReadModel) {
    this._repository = repository
    this._productReadModel = productReadModel
  }

  public receiveCommand(command: Command): void {
    switch (command.type) {
      case ADD_PRODUCTS:
        this.addProducts(command.payload)
        break
      case ADD_PRODUCT:
        this.addProduct(command.payload)
        break
    }
  }

  private addProduct(product: Product): void {
    this._repository.create(product)
    this._productReadModel.receiveEvent({type: PRODUCT_CREATED, payload: toData(product)})
  }

  private addProducts(data: ProductData[]): void {
    const products = data.map(Product.fromData)
    products.forEach(this.addProduct.bind(this))
  }
}
