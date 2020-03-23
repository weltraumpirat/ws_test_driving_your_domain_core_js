import {Product} from './product'
import {
  ProductData,
  ProductsReadModel
} from '../api/products_api'
import {toData} from '../conversion'

export interface ProductRepository {
  findAll(): Product[]

  create(product: Product): void
}

export class ProductFixture {
  private _repository: ProductRepository
  private _productReadModel: ProductsReadModel

  public constructor(repository: ProductRepository, productReadModel: ProductsReadModel) {
    this._repository = repository
    this._productReadModel = productReadModel
  }

  public addProduct(product: Product): void {
    this._repository.create(product)
    this._productReadModel.notifyProductCreated(toData(product))
  }

  public addProducts(data: ProductData[]): void {
    const products = data.map(Product.fromData)
    products.forEach(this.addProduct.bind(this))
  }
}
