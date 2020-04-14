import {
  ensure,
  UUID
} from '../../types'
import {ShoppingCartData} from './shoppingcart_fixture'

export class ShoppingCartItemCountReadModel {
  public readonly carts: Map<UUID, number>

  public constructor() {
    this.carts = new Map()
  }

  public getItemCount(id: UUID): number {
    return ensure(this.carts.get(id), `Shopping cart with id:${id} does not exist.`)
  }

  public notifyCartCreated(data: ShoppingCartData): void {
    this.carts.set(data.id, 0)
  }

  public notifyItemAdded(data: ShoppingCartData): void {
    this.carts.set(data.id, data.items.length)
  }

  public notifyItemRemoved(data: ShoppingCartData): void {
    this.carts.set(data.id, data.items.length)
  }

  public notifyCheckedOut(cart: ShoppingCartData): void {
    this.carts.delete(cart.id)
  }
}
