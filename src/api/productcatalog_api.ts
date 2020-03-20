import {
  PackagingType,
  Product
} from '../domain/product'
import {ProductCatalog} from '../domain/productcatalog'
import {toData} from '../conversion'

export interface ProductData {
  name: string
  packagingType: PackagingType
  amount: string
  price: string
}

export class ProductCatalogApi {
  private _catalog?: ProductCatalog

  public createCatalogWithProducts(products: ProductData[]): void {
    this._catalog = ProductCatalog.createWithProducts(products.map(Product.fromData))
  }

  public getProducts(): ProductData[] {
    return this._catalog ? toData(this._catalog.products) : []
  }
}
