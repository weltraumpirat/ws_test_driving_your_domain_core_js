import {ProductData} from '../../api/products_api'
import {ReadModel} from '../aggregate'
import {Event} from '../../eventbus'
import {PRODUCT_CREATED} from './product_messages'

export class ProductsReadModel implements ReadModel {
  public readonly products: ProductData[]

  public constructor() {
    this.products = []
  }

  public receiveEvent(event: Event): void {
    switch( event.type ) {
      case PRODUCT_CREATED:
        this.notifyProductCreated(event.payload)
        break
      default:
        break
    }
  }

  private notifyProductCreated(product: ProductData): void {
    this.products.push(product)
  }
}
