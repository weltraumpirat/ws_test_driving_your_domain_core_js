import {Product} from '../domain/product'
import {ProductRepository} from '../domain/product_fixture'

export class ProductRepositoryInMemory implements ProductRepository {
  private _products: Map<string, Product>

  public constructor() {
    this._products = new Map()
  }

  public findAll(): Product[] {
    return [...this._products.values()]
  }

  public create(product: Product): void {
    this._products.set(product.id, product)
  }
}
