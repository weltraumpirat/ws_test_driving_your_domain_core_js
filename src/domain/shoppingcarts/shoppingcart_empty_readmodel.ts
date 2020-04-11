import {UUID} from '../../types'
import {ShoppingCartData} from './shoppingcart_fixture'

export class ShoppingCartEmptyReadModel {
  public readonly carts: Set<UUID>

  public constructor() {
    this.carts = new Set()
  }

  public isEmpty(id: UUID): boolean {
    return this.carts.has(id)
  }

  public notifyCartCreated(data: ShoppingCartData): void {
    this.carts.add(data.id)
  }

  public notifyItemAdded(data: ShoppingCartData): void {
    this.carts.add(data.id)
  }

  public notifyItemRemoved(data: ShoppingCartData): void {
    if (data.items.length > 0) {
      this.carts.delete(data.id)
    }
  }

  public notifyCheckedOut(cart: ShoppingCartData): void {
    this.carts.delete(cart.id)
  }
}
