import {PackagingType} from '../domain/products/product'
import {ProductFixture} from '../domain/products/product_fixture'
import {ProductsReadModel} from '../domain/products/products_readmodel'

export interface ProductData {
  id?: string
  name: string
  packagingType: PackagingType
  amount: string
  price: string
}

export class ProductsApi {
  private _fixture: ProductFixture
  private _productsReadModel: ProductsReadModel

  public constructor(fixture: ProductFixture, productsReadModel: ProductsReadModel) {
    this._fixture = fixture
    this._productsReadModel = productsReadModel
  }

  public createCatalogWithProducts(products: ProductData[]): void {
    this._fixture.addProducts(products)
  }

  public getProducts(): ProductData[] {
    return this._productsReadModel.products
  }
}
