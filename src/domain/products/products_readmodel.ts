import {ProductData} from '../../api/products_api'
import {ReadModel} from '../aggregate'
import {
  Event,
  Eventbus
} from '../../eventbus'
import {PRODUCT_CREATED} from './product_messages'
import {Global} from '../../global'

export class ProductsReadModel extends ReadModel {
  public readonly products: ProductData[]

  public constructor(eventbus: Eventbus = Global.eventbus) {
    super(eventbus)
    this.products = []
    this._eventbus.subscribe(PRODUCT_CREATED, this.receiveEvent.bind(this))
  }

  protected receiveEvent(event: Event): void {
    switch (event.type) {
      case PRODUCT_CREATED:
        this.notifyProductCreated(event.payload)
        break
    }
  }

  private notifyProductCreated(product: ProductData): void {
    this.products.push(product)
  }
}
