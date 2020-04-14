import {
  ShoppingCart,
  ShoppingCartRepository
} from '../domain/shoppingcarts/shoppingcart'
import {
  ensure,
  UUID
} from '../types'

export class ShoppingCartRepositoryInMemory implements ShoppingCartRepository {
  private _shoppingCarts: Map<string, ShoppingCart>

  public constructor(carts?: ShoppingCart[]) {
    this._shoppingCarts = new Map()
    carts?.forEach(cart => this._shoppingCarts.set(cart.id, cart))
  }

  public findById(id: string): ShoppingCart | undefined {
    return this._shoppingCarts.get(id)
  }

  public getById(id: UUID): ShoppingCart {
    return ensure(this.findById(id), `ShoppingCart with id:${id} does not exist.`)
  }

  public create(cart: ShoppingCart): void {
    this._shoppingCarts.set(cart.id, cart)
  }

  public update(cart: ShoppingCart): void {
    this._shoppingCarts.set(cart.id, cart)
  }

  public delete(id: UUID): void {
    this._shoppingCarts.delete(id)
  }
}
