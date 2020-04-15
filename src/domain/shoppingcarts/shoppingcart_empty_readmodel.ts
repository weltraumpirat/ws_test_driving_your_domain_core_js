import {UUID} from '../../types'
import {ShoppingCartData} from './shoppingcart_fixture'
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

export class ShoppingCartEmptyReadModel extends ReadModel {
  public readonly carts: Set<UUID>

  public constructor(eventbus: Eventbus = Global.eventbus) {
    super(eventbus)
    this.carts = new Set()
    eventbus.subscribe(SHOPPING_CART_CREATED, this.receiveEvent.bind(this))
    eventbus.subscribe(SHOPPING_CART_CHECKED_OUT, this.receiveEvent.bind(this))
    eventbus.subscribe(SHOPPING_CART_ITEM_ADDED, this.receiveEvent.bind(this))
    eventbus.subscribe(SHOPPING_CART_ITEM_REMOVED, this.receiveEvent.bind(this))
  }

  public isEmpty(id: UUID): boolean {
    return this.carts.has(id)
  }

  protected receiveEvent(event: Event): void {
    switch (event.type) {
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

  private notifyCartCreated(data: ShoppingCartData): void {
    this.carts.add(data.id)
  }

  private notifyItemAdded(data: ShoppingCartData): void {
    this.carts.delete(data.id)
  }

  private notifyItemRemoved(data: ShoppingCartData): void {
    if (data.items.length == 0) {
      this.carts.add(data.id)
    }
  }

  private notifyCheckedOut(cart: ShoppingCartData): void {
    this.carts.delete(cart.id)
  }
}
