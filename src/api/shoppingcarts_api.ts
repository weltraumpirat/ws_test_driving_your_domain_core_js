import {
  ShoppingCartData,
  ShoppingCartFixture
} from '../domain/shoppingcart_fixture'
import {
  ensure,
  UUID
} from '../types'
import {ShoppingCart} from '../domain/shoppingcart'

export interface ShoppingCartItemData {
  id: string
  name: string
  label?: string
  packagingType: string
  amount: string
  price: string
}

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

export class ShoppingCartsApi {
  private _fixture: ShoppingCartFixture

  public constructor(fixture: ShoppingCartFixture) {
    this._fixture = fixture
  }

  public createEmptyShoppingCart(): string {
    return this._fixture.createShoppingCart([])
  }

  public createShoppingCartWithItems(...items: ShoppingCartItemData[]): string {
    return this._fixture.createShoppingCart(items)
  }

  public addItemToShoppingCart(cartId: string, data: ShoppingCartItemData): void {
    this._fixture.addItemToShoppingCart(cartId, data)
  }

  public removeItemFromShoppingCart(cartId: string, item: ShoppingCartItemData): void {
    this._fixture.removeItemFromShoppingCart(cartId, item)
  }

  public checkOut(id: string): void {
    this._fixture.checkOut(id)
  }

  public getShoppingCartItems(id: string): ShoppingCartItemData[] {
    return this._fixture.getShoppingCartItems(id)
  }

  public getShoppingCartItemCount(id: string): number {
    return this.getShoppingCartItems(id).length
  }

  public isShoppingCartEmpty(id: string): boolean {
    return this._fixture.isShoppingCartEmpty(id)
  }
}
