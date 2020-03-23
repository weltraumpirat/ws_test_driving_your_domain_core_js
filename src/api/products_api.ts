import {
  PackagingType,
  Product
} from '../domain/product'
import {ProductFixture} from '../domain/productFixture'
import {toData} from '../conversion'
import {ProductRepositoryInMemory} from '../persistence/product_repository'

export interface ProductData {
  id?: string
  name: string
  packagingType: PackagingType
  amount: string
  price: string
}

export class ProductsApi {
  private _catalog?: ProductFixture

  public createCatalogWithProducts(products: ProductData[]): void {
    const repository = new ProductRepositoryInMemory(products.map(Product.fromData))
    this._catalog = new ProductFixture(repository)
  }

  public getProducts(): ProductData[] {
    return this._catalog ? toData(this._catalog.products) : []
  }
}
