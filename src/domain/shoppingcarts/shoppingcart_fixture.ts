import {
  ShoppingCart,
  ShoppingCartItem,
  ShoppingCartRepository
} from './shoppingcart'
import {CheckoutService} from '../checkout/checkoutservice'
import {UUID} from '../../types'
import {validateShoppingCartItem} from '../../validation'
import {OrderPosition} from '../orders/order'
import {toData} from '../../conversion'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {ProductsReadModel} from '../products/products_readmodel'
import {ShoppingCartItemsReadModel} from './shoppingcarts_readmodel'
import {ShoppingCartEmptyReadModel} from './shoppingcart_empty_readmodel'

export interface ShoppingCartData {
  id: UUID
  items: ShoppingCartItemData[]
}

export interface OrderData {
  id: UUID
  positions: OrderPosition[]
  total: string
}

export class ShoppingCartFixture {
  private _shoppingCartRepository: ShoppingCartRepository
  private _shoppingCartItemsReadModel: ShoppingCartItemsReadModel
  private _shoppingCartEmptyReadModel: ShoppingCartEmptyReadModel
  private _checkoutService: CheckoutService
  private _productsReadModel: ProductsReadModel


  public constructor(repository: ShoppingCartRepository, itemsReadModel: ShoppingCartItemsReadModel, emptyReadModel: ShoppingCartEmptyReadModel, productsReadModel: ProductsReadModel, checkoutService: CheckoutService) {
    this._shoppingCartRepository = repository
    this._shoppingCartItemsReadModel = itemsReadModel
    this._shoppingCartEmptyReadModel = emptyReadModel
    this._productsReadModel = productsReadModel
    this._checkoutService = checkoutService
  }

  public createShoppingCart(items: ShoppingCartItemData[]): UUID {
    const cart = ShoppingCart.createWithItems(...(items.map(ShoppingCartItem.fromData)))
    this._shoppingCartRepository.create(cart)
    const data: ShoppingCartData = toData(cart)
    this._shoppingCartItemsReadModel.notifyCartCreated(data)
    this._shoppingCartEmptyReadModel.notifyCartCreated(data)
    return cart.id
  }

  public addItemToShoppingCart(cartId: UUID, itemData: ShoppingCartItemData): void {
    const item = ShoppingCartItem.fromData(itemData)
    validateShoppingCartItem(item, this._productsReadModel.products)
    const cart = this._shoppingCartRepository.findById(cartId)
    cart.addItem(item)
    this._shoppingCartRepository.update(cart)
    const cartData: ShoppingCartData = toData(cart)
    this._shoppingCartItemsReadModel.notifyItemAdded(cartData)
    this._shoppingCartEmptyReadModel.notifyItemAdded(cartData)
  }

  public removeItemFromShoppingCart(cartId: UUID, item: ShoppingCartItemData): void {
    const cart = this._shoppingCartRepository.findById(cartId)
    cart.removeItem(ShoppingCartItem.fromData(item))
    this._shoppingCartRepository.update(cart)
    const cartData: ShoppingCartData = toData(cart)
    this._shoppingCartItemsReadModel.notifyItemRemoved(cartData)
    this._shoppingCartEmptyReadModel.notifyItemRemoved(cartData)
  }

  public checkOut(id: UUID): void {
    const cart = this._shoppingCartRepository.findById(id)
    const items = cart.items.map(toData) as ShoppingCartItemData[]
    this._checkoutService.checkOut(items)
    const cartData: ShoppingCartData = toData(cart)
    this._shoppingCartItemsReadModel.notifyCheckedOut(cartData)
    this._shoppingCartEmptyReadModel.notifyCheckedOut(cartData)
  }

  public isShoppingCartEmpty(id: UUID): boolean {
    return this._shoppingCartEmptyReadModel.isEmpty(id)
  }

  public getShoppingCartItems(id: UUID): ShoppingCartItemData[] {
    return this._shoppingCartItemsReadModel.getItems(id)
  }
}
