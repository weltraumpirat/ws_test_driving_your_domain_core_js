import {Product} from '../domain/products/product'
import {ProductRepository} from '../domain/products/product_fixture'
import {UUID} from '../types'

export class ProductRepositoryInMemory implements ProductRepository {
  private _products: Map<string, Product>

  public constructor() {
    this._products = new Map()
  }

  public findAll(): Product[] {
    return [...this._products.values()]
  }

  public findById(id: UUID): Product | undefined {
    return this._products.get(id)
  }

  public create(product: Product): void {
    this._products.set(product.id, product)
  }
}
