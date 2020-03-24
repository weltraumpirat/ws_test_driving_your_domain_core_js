import {
  ShoppingCart,
  ShoppingCartRepository
} from '../domain/shoppingcart'
import {ensure} from '../types'

export class ShoppingCartRepositoryInMemory implements ShoppingCartRepository {
  private _shoppingCarts: Map<string, ShoppingCart>

  public constructor(carts?: ShoppingCart[]) {
    this._shoppingCarts = new Map()
    carts?.forEach(cart => this._shoppingCarts.set(cart.id, cart))
  }

  public findById(id: string): ShoppingCart {
    return ensure(this._shoppingCarts.get(id), `ShoppingCart with id:${id} does not exist.`)
  }

  public create(cart: ShoppingCart): void {
    this._shoppingCarts.set(cart.id, cart)
  }

  public update(cart: ShoppingCart): void {
    this._shoppingCarts.set(cart.id, cart)
  }
}
