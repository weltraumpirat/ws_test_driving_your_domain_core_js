import {
  ShoppingCart,
  ShoppingCartItem
} from '../domain/shoppingcart'
import {CheckoutService} from '../domain/checkoutservice'
import {Order} from '../domain/order'
import {ProductCatalogApi} from './productcatalog_api'
import {validateShoppingCartItem} from '../validation'
import {toData} from '../conversion'

export interface ShoppingCartItemData {
  id: string
  name: string
  label?: string
  packagingType: string
  amount: string
  price: string
}

export class ShoppingCartApi {
  private _shoppingCart: ShoppingCart
  private _checkoutService: CheckoutService
  private _productCatalogApi: ProductCatalogApi

  public constructor(productCatalogApi: ProductCatalogApi) {
    this._productCatalogApi = productCatalogApi
    this._shoppingCart = ShoppingCart.createEmpty()
    this._checkoutService = new CheckoutService()
  }

  public createEmptyShoppingCart(): void {
    this._shoppingCart = ShoppingCart.createEmpty()
  }

  public createShoppingCartWithItems(...items: ShoppingCartItemData[]): void {
    this._shoppingCart = ShoppingCart.createWithItems(...(items.map(ShoppingCartItem.fromData)))
  }

  public addItemToShoppingCart(data: ShoppingCartItemData): void {
    const item = ShoppingCartItem.fromData(data)
    validateShoppingCartItem(item, this._productCatalogApi.getProducts())
    this._shoppingCart.addItem(item)
  }

  public removeItemFromShoppingCart(item: ShoppingCartItemData): void {
    this._shoppingCart.removeItem(ShoppingCartItem.fromData(item))
  }

  public checkOut(): Order {
    return this._checkoutService.checkOut(this._shoppingCart.items.map(toData) as ShoppingCartItemData[])
  }

  public isShoppingCartEmpty(): boolean {
    return this._shoppingCart.empty
  }

  public getShoppingCartItemCount(): number {
    return this._shoppingCart.items.length
  }

  public getShoppingCartItems(): ShoppingCartItemData[] {
    return this._shoppingCart.items.map(toData) as ShoppingCartItemData[]
  }
}
