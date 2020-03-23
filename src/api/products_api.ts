import {PackagingType} from '../domain/product'
import {ProductFixture} from '../domain/product_fixture'

export interface ProductData {
  id?: string
  name: string
  packagingType: PackagingType
  amount: string
  price: string
}

export class ProductsReadModel {
  public readonly products: ProductData[]

  public constructor() {
    this.products = []
  }

  public notifyProductCreated(product: ProductData): void {
    this.products.push(product)
  }
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
