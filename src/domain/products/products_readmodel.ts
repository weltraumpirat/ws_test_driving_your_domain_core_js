import {ProductData} from '../../api/products_api'
import {ReadModel} from '../aggregate'
import {
  Event,
  Eventbus
} from '../../eventbus'
import {PRODUCT_CREATED} from './product_messages'
import {Global} from '../../global'

export class ProductsReadModel implements ReadModel {
  public readonly products: ProductData[]
  private _eventbus: Eventbus

  public constructor(eventbus: Eventbus = Global.eventbus) {
    this.products = []
    this._eventbus = eventbus
    this._eventbus.subscribe(PRODUCT_CREATED, this.receiveEvent.bind(this))
  }

  public receiveEvent(event: Event): void {
    switch( event.type ) {
      case PRODUCT_CREATED:
        this.notifyProductCreated(event.payload)
        break
    }
  }

  private notifyProductCreated(product: ProductData): void {
    this.products.push(product)
  }
}
