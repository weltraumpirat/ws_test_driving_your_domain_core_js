import {
  ensure,
  UUID
} from '../types'
import {ShoppingCartData} from './shoppingcart_fixture'
import {ShoppingCart} from './shoppingcart'

export class ShoppingCartsReadModel {
  public readonly carts: Map<UUID, ShoppingCartData>

  public constructor() {
    this.carts = new Map()
  }

  public notifyCartCreated(data: ShoppingCartData): void {
    this.carts.set(data.id, data)
  }

  public getById(id: UUID): ShoppingCartData {
    return ensure(this.carts.get(id), `Shopping cart with id:${id} does not exist.`)
  }

  public notifyItemAdded(data: ShoppingCartData): void {
    this.carts.set(data.id, data)
  }

  public notifyItemRemoved(data: ShoppingCartData): void {
    this.carts.set(data.id, data)
  }

  public notifyCheckedOut(cart: ShoppingCart): void {
    this.carts.delete(cart.id)
  }
}
