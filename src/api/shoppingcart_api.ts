import {
  ShoppingCart,
  ShoppingCartItem
} from '../domain/shoppingcart'
import {CheckoutService} from '../domain/checkoutservice'
import {Order} from '../domain/order'

export class ShoppingCartApi {
  private _shoppingCart: ShoppingCart
  private _checkoutService: CheckoutService

  constructor() {
    this._shoppingCart = ShoppingCart.createEmpty()
    this._checkoutService = new CheckoutService()
  }

  public createEmptyShoppingCart() {
    this._shoppingCart = ShoppingCart.createEmpty()
  }

  public createShoppingCartWithItems(...items: ShoppingCartItem[]) {
    this._shoppingCart = ShoppingCart.createWithItems(...items)
  }

  public addItemToShoppingCart(item: ShoppingCartItem) {
    this._shoppingCart.addItem(item)
  }

  public removeItemFromShoppingCart(item: ShoppingCartItem) {
    this._shoppingCart.removeItem(item)
  }

  public checkOut(): Order {
    return this._checkoutService.checkOut(this._shoppingCart.items)
  }

  public isShoppingCartEmpty(): boolean {
    return this._shoppingCart.empty
  }

  public getShoppingCartItemCount(): number {
    return this._shoppingCart.items.length
  }

  public getShoppingCartItems(): ShoppingCartItem[] {
    return this._shoppingCart.items
  }
}
