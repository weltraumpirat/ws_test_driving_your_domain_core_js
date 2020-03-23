import {
  ShoppingCart,
  ShoppingCartItem,
  ShoppingCartRepository
} from '../domain/shoppingcart'
import {CheckoutService} from '../domain/checkoutservice'
import {Order} from '../domain/order'
import {ProductsApi} from './products_api'
import {validateShoppingCartItem} from '../validation'
import {toData} from '../conversion'
import {UUID} from '../types'

export interface ShoppingCartItemData {
  id: string
  name: string
  label?: string
  packagingType: string
  amount: string
  price: string
}

export class ShoppingCartApi {
  private _shoppingCartRepository: ShoppingCartRepository
  private _checkoutService: CheckoutService
  private _productCatalogApi: ProductsApi

  public constructor(repository: ShoppingCartRepository, productCatalogApi: ProductsApi, checkoutService: CheckoutService) {
    this._shoppingCartRepository = repository
    this._productCatalogApi = productCatalogApi
    this._checkoutService = checkoutService
  }

  public createEmptyShoppingCart(): UUID {
    const cart = ShoppingCart.createEmpty()
    this._shoppingCartRepository.create(cart)
    return cart.id
  }

  public createShoppingCartWithItems(...items: ShoppingCartItemData[]): UUID {
    const cart = ShoppingCart.createWithItems(...(items.map(ShoppingCartItem.fromData)))
    this._shoppingCartRepository.create(cart)
    return cart.id
  }

  public addItemToShoppingCart(cartId: UUID, data: ShoppingCartItemData): void {
    const item = ShoppingCartItem.fromData(data)
    validateShoppingCartItem(item, this._productCatalogApi.getProducts())
    this._shoppingCartRepository.findById(cartId).addItem(item)
  }

  public removeItemFromShoppingCart(cartId: UUID, item: ShoppingCartItemData): void {
    this._shoppingCartRepository.findById(cartId).removeItem(ShoppingCartItem.fromData(item))
  }

  public checkOut(id: UUID): Order {
    return this._checkoutService.checkOut(this._shoppingCartRepository.findById(id).items.map(toData) as ShoppingCartItemData[])
  }

  public isShoppingCartEmpty(id: UUID): boolean {
    return this._shoppingCartRepository.findById(id).empty
  }

  public getShoppingCartItemCount(id: UUID): number {
    return this._shoppingCartRepository.findById(id).items.length
  }
  public getShoppingCartItems(id: UUID): ShoppingCartItemData[] {
    return this._shoppingCartRepository.findById(id).items.map(toData) as ShoppingCartItemData[]
  }
}
