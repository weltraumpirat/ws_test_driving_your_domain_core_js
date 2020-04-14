import {PackagingType} from '../domain/products/product'
import {ProductFixture} from '../domain/products/product_fixture'
import {ADD_PRODUCTS} from '../domain/products/product_messages'
import {Global} from '../global'

export interface ProductData {
  id?: string
  name: string
  packagingType: PackagingType
  amount: string
  price: string
}

export class ProductsApi {
  private _fixture: ProductFixture
  private _eventbus = Global.eventbus

  public constructor(fixture: ProductFixture) {
    this._fixture = fixture
  }

  public createCatalogWithProducts(products: ProductData[]): void {
    this._eventbus.dispatch({type: ADD_PRODUCTS, payload: products})
  }
}
