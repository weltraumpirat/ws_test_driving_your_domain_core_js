import {
  ShoppingCart,
  ShoppingCartItem
} from '../domain/shoppingcart'
import {CheckoutService} from '../domain/checkoutservice'
import {Order} from '../domain/order'
import {ProductCatalogApi} from './productcatalog_api'
import {validateShoppingCartItem} from '../validation'
import {toData} from '../conversion'
import {
  ensure,
  UUID
} from '../types'

export interface ShoppingCartItemData {
  id: string
  name: string
  label?: string
  packagingType: string
  amount: string
  price: string
}

export class ShoppingCartApi {
  private _shoppingCarts: Map<string,ShoppingCart>
  private _checkoutService: CheckoutService
  private _productCatalogApi: ProductCatalogApi

  public constructor(productCatalogApi: ProductCatalogApi) {
    this._productCatalogApi = productCatalogApi
    this._shoppingCarts = new Map()
    this._checkoutService = new CheckoutService()
  }

  public createEmptyShoppingCart(): UUID {
    const cart = ShoppingCart.createEmpty()
    this._shoppingCarts.set(cart.id, cart)
    return cart.id
  }

  public createShoppingCartWithItems(...items: ShoppingCartItemData[]): UUID {
    const cart = ShoppingCart.createWithItems(...(items.map(ShoppingCartItem.fromData)))
    this._shoppingCarts.set(cart.id, cart)
    return cart.id
  }

  public addItemToShoppingCart(cartId: UUID, data: ShoppingCartItemData): void {
    const item = ShoppingCartItem.fromData(data)
    validateShoppingCartItem(item, this._productCatalogApi.getProducts())
    ensure(this._shoppingCarts.get(cartId)).addItem(item)
  }

  public removeItemFromShoppingCart(cartId: UUID, item: ShoppingCartItemData): void {
    ensure(this._shoppingCarts.get(cartId)).removeItem(ShoppingCartItem.fromData(item))
  }

  public checkOut(id: UUID): Order {
    return this._checkoutService.checkOut(this.findById(id).items.map(toData) as ShoppingCartItemData[])
  }

  public isShoppingCartEmpty(id: UUID): boolean {
    return this.findById(id).empty
  }

  public getShoppingCartItemCount(id: UUID): number {
    return this.findById(id).items.length
  }

  private findById(id: string): ShoppingCart {
    return ensure(this._shoppingCarts.get(id))
  }

  public getShoppingCartItems(id: UUID): ShoppingCartItemData[] {
    return this.findById(id).items.map(toData) as ShoppingCartItemData[]
  }
}
