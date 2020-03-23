import {
  PackagingType,
  Product
} from '../domain/product'
import {ProductFixture} from '../domain/product_fixture'
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
  private _fixture: ProductFixture

  public constructor(fixture: ProductFixture) {
    this._fixture = fixture
  }

  public createCatalogWithProducts(products: ProductData[]): void {
    this._fixture.addProducts(products)
  }

  public getProducts(): ProductData[] {
    return this._fixture ? toData(this._fixture.products) : []
  }
}
