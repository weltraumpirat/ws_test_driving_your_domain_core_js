import {
  ensure,
  UUID
} from '../../types'
import {ShoppingCartData} from './shoppingcart_fixture'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {ReadModel} from '../abstract_types'
import {
  Event,
  Eventbus
} from '../../eventbus'
import {Global} from '../../global'
import {
  SHOPPING_CART_CHECKED_OUT,
  SHOPPING_CART_CREATED,
  SHOPPING_CART_ITEM_ADDED,
  SHOPPING_CART_ITEM_REMOVED
} from './shoppingcart_messages'

export class ShoppingCartItemsReadModel extends ReadModel{
  public readonly carts: Map<UUID, ShoppingCartItemData[]>

  public constructor(eventbus: Eventbus = Global.eventbus) {
    super(eventbus)
    this.carts = new Map()
    this._eventbus.subscribe(SHOPPING_CART_CREATED, this.receiveEvent.bind(this))
    this._eventbus.subscribe(SHOPPING_CART_CHECKED_OUT, this.receiveEvent.bind(this))
    this._eventbus.subscribe(SHOPPING_CART_ITEM_ADDED, this.receiveEvent.bind(this))
    this._eventbus.subscribe(SHOPPING_CART_ITEM_REMOVED, this.receiveEvent.bind(this))
  }

  protected receiveEvent(event: Event): void {
    switch(event.type ) {
      case SHOPPING_CART_CREATED:
        this.notifyCartCreated(event.payload)
        break
      case SHOPPING_CART_CHECKED_OUT:
        this.notifyCheckedOut(event.payload)
        break
      case SHOPPING_CART_ITEM_ADDED:
        this.notifyItemAdded(event.payload)
        break
      case SHOPPING_CART_ITEM_REMOVED:
        this.notifyItemRemoved(event.payload)
        break
    }
  }

  public getItems(id: UUID): ShoppingCartItemData[] {
    return ensure(this.carts.get(id), `Shopping cart with id:${id} does not exist.`)
  }

  private notifyCartCreated(data: ShoppingCartData): void {
    this.carts.set(data.id, [])
  }

  private notifyItemAdded(data: ShoppingCartData): void {
    this.carts.set(data.id, data.items)
  }

  private notifyItemRemoved(data: ShoppingCartData): void {
    this.carts.set(data.id, data.items)
  }

  private notifyCheckedOut(cart: ShoppingCartData): void {
    this.carts.delete(cart.id)
  }
}
