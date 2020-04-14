import {
  ShoppingCart,
  ShoppingCartItem,
  ShoppingCartRepository
} from './shoppingcart'
import {CheckoutService} from '../checkout/checkoutservice'
import {UUID} from '../../types'
import {validateShoppingCartItem} from '../../validation'
import {toData} from '../../conversion'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {ProductsReadModel} from '../products/products_readmodel'
import {ShoppingCartItemsReadModel} from './shoppingcart_items_readmodel'
import {
  ShoppingCartEmptyReadModel
} from './shoppingcart_empty_readmodel'
import {ShoppingCartItemCountReadModel} from './shoppingcart_itemcount_readmodel'
import {Global} from '../../global'
import {AggregateFixture} from '../aggregate'
import {Command} from '../../eventbus'
import {
  ADD_ITEM_TO_SHOPPING_CART,
  CHECK_OUT_SHOPPING_CART,
  CREATE_SHOPPING_CART,
  REMOVE_ITEM_FROM_SHOPPING_CART,
  SHOPPING_CART_CHECKED_OUT,
  SHOPPING_CART_CREATED,
  SHOPPING_CART_ITEM_ADDED,
  SHOPPING_CART_ITEM_REMOVED
} from './shoppingcart_messages'

export interface ShoppingCartData {
  id: UUID
  items: ShoppingCartItemData[]
}




export class ShoppingCartFixture extends AggregateFixture {
  private _shoppingCartRepository: ShoppingCartRepository
  private _shoppingCartItemsReadModel: ShoppingCartItemsReadModel
  private _shoppingCartEmptyReadModel: ShoppingCartEmptyReadModel
  private _checkoutService: CheckoutService
  private _productsReadModel: ProductsReadModel
  private _shoppingCartItemCountReadModel: ShoppingCartItemCountReadModel


  public constructor(repository: ShoppingCartRepository, itemsReadModel: ShoppingCartItemsReadModel, itemCountReadModel: ShoppingCartItemCountReadModel, emptyReadModel: ShoppingCartEmptyReadModel, productsReadModel: ProductsReadModel, checkoutService: CheckoutService) {
    super(Global.eventbus)
    this._shoppingCartRepository = repository
    this._shoppingCartItemsReadModel = itemsReadModel
    this._shoppingCartItemCountReadModel = itemCountReadModel
    this._shoppingCartEmptyReadModel = emptyReadModel
    this._productsReadModel = productsReadModel
    this._checkoutService = checkoutService
    this._eventbus.subscribe(CREATE_SHOPPING_CART, this.receiveCommand.bind(this))
    this._eventbus.subscribe(CHECK_OUT_SHOPPING_CART, this.receiveCommand.bind(this))
    this._eventbus.subscribe(ADD_ITEM_TO_SHOPPING_CART, this.receiveCommand.bind(this))
    this._eventbus.subscribe(REMOVE_ITEM_FROM_SHOPPING_CART, this.receiveCommand.bind(this))
  }

  protected receiveCommand(command: Command): void {
    switch(command.type) {
      case CREATE_SHOPPING_CART:
        this.createShoppingCart(command.payload)
        break
      case CHECK_OUT_SHOPPING_CART:
        this.checkOut(command.payload)
        break
      case ADD_ITEM_TO_SHOPPING_CART:
        this.addItemToShoppingCart(command.payload.id, command.payload.item)
        break
      case REMOVE_ITEM_FROM_SHOPPING_CART:
        this.removeItemFromShoppingCart(command.payload.id, command.payload.item)
    }
  }

  public createShoppingCart(items: ShoppingCartItemData[]): void {
    const cart = ShoppingCart.createWithItems(...(items.map(ShoppingCartItem.fromData)))
    this._shoppingCartRepository.create(cart)
    const data: ShoppingCartData = toData(cart)
    this._shoppingCartItemsReadModel.notifyCartCreated(data)
    this._shoppingCartItemCountReadModel.notifyCartCreated(data)
    this._eventbus.dispatch({type: SHOPPING_CART_CREATED, payload: data})
  }

  public addItemToShoppingCart(cartId: UUID, itemData: ShoppingCartItemData): void {
    const item = ShoppingCartItem.fromData(itemData)
    validateShoppingCartItem(item, this._productsReadModel.products)
    const cart = this._shoppingCartRepository.findById(cartId)
    cart.addItem(item)
    this._shoppingCartRepository.update(cart)
    const cartData: ShoppingCartData = toData(cart)
    this._shoppingCartItemsReadModel.notifyItemAdded(cartData)
    this._shoppingCartItemCountReadModel.notifyItemAdded(cartData)
    this._eventbus.dispatch({type: SHOPPING_CART_ITEM_ADDED, payload: cartData})
  }

  public removeItemFromShoppingCart(cartId: UUID, item: ShoppingCartItemData): void {
    const cart = this._shoppingCartRepository.findById(cartId)
    cart.removeItem(ShoppingCartItem.fromData(item))
    this._shoppingCartRepository.update(cart)
    const cartData: ShoppingCartData = toData(cart)
    this._shoppingCartItemsReadModel.notifyItemRemoved(cartData)
    this._shoppingCartItemCountReadModel.notifyItemRemoved(cartData)
    this._eventbus.dispatch({type: SHOPPING_CART_ITEM_REMOVED, payload: cartData})
  }

  public checkOut(id: UUID): void {
    const cart = this._shoppingCartRepository.findById(id)
    const items = cart.items.map(toData) as ShoppingCartItemData[]
    this._checkoutService.checkOut(items)
    const cartData: ShoppingCartData = toData(cart)
    this._shoppingCartItemsReadModel.notifyCheckedOut(cartData)
    this._shoppingCartItemCountReadModel.notifyCheckedOut(cartData)
    this._eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: cartData})
  }
}
