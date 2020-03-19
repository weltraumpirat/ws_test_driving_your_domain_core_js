import {Product} from './product'

export class ProductCatalog {
  private _products: Product[]

  public constructor(products?: Product[]) {
    this._products = products || []
  }

  public get products(): Product[] {
    return this._products
  }

  public static createWithProducts(products: Product[]): ProductCatalog {
    return new ProductCatalog(products)
  }

  public static createEmpty(): ProductCatalog {
    return new ProductCatalog()
  }
}
