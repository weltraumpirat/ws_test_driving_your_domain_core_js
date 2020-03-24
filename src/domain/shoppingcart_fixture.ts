import {
  ShoppingCart,
  ShoppingCartItem,
  ShoppingCartRepository
} from './shoppingcart'
import {CheckoutService} from './checkoutservice'
import {ProductsReadModel} from '../api/products_api'
import {UUID} from '../types'
import {validateShoppingCartItem} from '../validation'
import {OrderPosition} from './order'
import {toData} from '../conversion'
import {
  ShoppingCartItemData,
  ShoppingCartsReadModel
} from '../api/shoppingcarts_api'

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
  private _shoppingCartsReadModel: ShoppingCartsReadModel
  private _checkoutService: CheckoutService
  private _productsReadModel: ProductsReadModel


  public constructor(repository: ShoppingCartRepository, readModel: ShoppingCartsReadModel, productsReadModel: ProductsReadModel, checkoutService: CheckoutService) {
    this._shoppingCartRepository = repository
    this._shoppingCartsReadModel = readModel
    this._productsReadModel = productsReadModel
    this._checkoutService = checkoutService
  }

  public createShoppingCart(items: ShoppingCartItemData[]): UUID {
    const cart = ShoppingCart.createWithItems(...(items.map(ShoppingCartItem.fromData)))
    this._shoppingCartRepository.create(cart)
    this._shoppingCartsReadModel.notifyCartCreated(toData(cart))
    return cart.id
  }

  public addItemToShoppingCart(cartId: UUID, data: ShoppingCartItemData): void {
    const item = ShoppingCartItem.fromData(data)
    validateShoppingCartItem(item, this._productsReadModel.products)
    const cart = this._shoppingCartRepository.findById(cartId)
    cart.addItem(item)
    this._shoppingCartRepository.update(cart)
    this._shoppingCartsReadModel.notifyItemAdded(toData(cart))
  }

  public removeItemFromShoppingCart(cartId: UUID, item: ShoppingCartItemData): void {
    const cart = this._shoppingCartRepository.findById(cartId)
    cart.removeItem(ShoppingCartItem.fromData(item))
    this._shoppingCartRepository.update(cart)
    this._shoppingCartsReadModel.notifyItemRemoved(toData(cart))
  }

  public checkOut(id: UUID): void {
    const cart = this._shoppingCartRepository.findById(id)
    const items = cart.items.map(toData) as ShoppingCartItemData[]
    this._checkoutService.checkOut(items)
    this._shoppingCartsReadModel.notifyCheckedOut(cart)
  }

  public isShoppingCartEmpty(id: UUID): boolean {
    return this._shoppingCartRepository.findById(id).empty
  }

  public getShoppingCartItems(id: UUID): ShoppingCartItemData[] {
    return this._shoppingCartRepository.findById(id).items.map(toData) as ShoppingCartItemData[]
  }
}
