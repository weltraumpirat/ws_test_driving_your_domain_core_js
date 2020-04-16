import {ProductData} from '../../api/products_api'
import {ReadModel} from '../abstract_types'
import {
  Event,
  Eventbus
} from '../../eventbus'
import {Global} from '../../global'
import {PRODUCT_CREATED} from './external_messages'

export class ProductsReadModel extends ReadModel {
  private _products: ProductData[]

  public constructor(eventbus: Eventbus = Global.eventbus) {
    super(eventbus)
    this._products = []
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
    this._products.push(product)
  }

  public getProducts(): ProductData[] {
    return this._products
  }
}
