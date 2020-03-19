import {Product} from '../domain/product'
import {ProductCatalog} from '../domain/productcatalog'

export class ProductCatalogApi {
  private _catalog?: ProductCatalog

  public createCatalogWithProducts(products: Product[]): void {
    this._catalog = ProductCatalog.createWithProducts(products)
  }

  public getProducts(): Product[] {
    return this._catalog ? this._catalog.products : []
  }
}
