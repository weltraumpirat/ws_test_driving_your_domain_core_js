import {Product} from '../domain/product'
import {ProductRepository} from '../domain/productcatalog'

export class ProductRepositoryInMemory implements ProductRepository {
  private _products: Map<string, Product>

  public constructor(products?: Product[]) {
    this._products = new Map()
    if (products) {
      products.forEach(p => this._products.set(p.id, p))
    }
  }

  public findAll(): Product[] {
    return [...this._products.values()]
  }

  public create(product: Product): void {
    this._products.set(product.id, product)
  }
}
