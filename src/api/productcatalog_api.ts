import {
  PackagingType,
  Product
} from '../domain/product'
import {ProductCatalog} from '../domain/productcatalog'
import {toData} from '../conversion'
import {ProductRepositoryInMemory} from '../persistence/product_repository'

export interface ProductData {
  id?: string
  name: string
  packagingType: PackagingType
  amount: string
  price: string
}

export class ProductCatalogApi {
  private _catalog?: ProductCatalog

  public createCatalogWithProducts(products: ProductData[]): void {
    this._catalog = ProductCatalog.create(new ProductRepositoryInMemory(products.map(Product.fromData)))
  }

  public getProducts(): ProductData[] {
    return this._catalog ? toData(this._catalog.products) : []
  }
}
