import {ProductData} from '../../api/products_api'

export class ProductsReadModel {
  public readonly products: ProductData[]

  public constructor() {
    this.products = []
  }

  public notifyProductCreated(product: ProductData): void {
    this.products.push(product)
  }
}
