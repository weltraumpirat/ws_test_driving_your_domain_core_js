import {
  ensure,
  UUID
} from '../../types'
import {ShoppingCartData} from './shoppingcart_fixture'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'

export class ShoppingCartItemsReadModel {
  public readonly carts: Map<UUID, ShoppingCartItemData[]>

  public constructor() {
    this.carts = new Map()
  }

  public getItems(id: UUID): ShoppingCartItemData[] {
    return ensure(this.carts.get(id), `Shopping cart with id:${id} does not exist.`)
  }

  public notifyCartCreated(data: ShoppingCartData): void {
    this.carts.set(data.id, [])
  }

  public notifyItemAdded(data: ShoppingCartData): void {
    this.carts.set(data.id, data.items)
  }

  public notifyItemRemoved(data: ShoppingCartData): void {
    this.carts.set(data.id, data.items)
  }

  public notifyCheckedOut(cart: ShoppingCartData): void {
    this.carts.delete(cart.id)
  }
}
