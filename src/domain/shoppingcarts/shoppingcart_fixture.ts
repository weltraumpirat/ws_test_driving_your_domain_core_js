import {
  ShoppingCart,
  ShoppingCartItem,
  ShoppingCartRepository
} from './shoppingcart'
import {UUID} from '../../types'
import {validateShoppingCartItem} from '../../validation'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {Global} from '../../global'
import {AggregateFixture} from '../aggregate'
import {Command} from '../../eventbus'
import {
  ADD_ITEM_TO_SHOPPING_CART,
  CHECK_OUT_SHOPPING_CART,
  CREATE_SHOPPING_CART,
  REMOVE_ITEM_FROM_SHOPPING_CART
} from './shoppingcart_messages'
import {ProductsReadModel} from './products_readmodel'

export interface ShoppingCartData {
  id: UUID
  items: ShoppingCartItemData[]
}


export class ShoppingCartFixture extends AggregateFixture {
  private _shoppingCartRepository: ShoppingCartRepository
  private _productsReadModel: ProductsReadModel


  public constructor(repository: ShoppingCartRepository, productsReadModel: ProductsReadModel) {
    super(Global.eventbus)
    this._shoppingCartRepository = repository
    this._productsReadModel = productsReadModel
    this._eventbus.subscribe(CREATE_SHOPPING_CART, this.receiveCommand.bind(this))
    this._eventbus.subscribe(CHECK_OUT_SHOPPING_CART, this.receiveCommand.bind(this))
    this._eventbus.subscribe(ADD_ITEM_TO_SHOPPING_CART, this.receiveCommand.bind(this))
    this._eventbus.subscribe(REMOVE_ITEM_FROM_SHOPPING_CART, this.receiveCommand.bind(this))
  }

  protected receiveCommand(command: Command): void {
    switch (command.type) {
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
  }

  public addItemToShoppingCart(cartId: UUID, itemData: ShoppingCartItemData): void {
    const item = ShoppingCartItem.fromData(itemData)
    validateShoppingCartItem(item, this._productsReadModel.products)
    const cart = this._shoppingCartRepository.getById(cartId)
    cart.addItem(item)
    this._shoppingCartRepository.update(cart)
  }

  public removeItemFromShoppingCart(cartId: UUID, item: ShoppingCartItemData): void {
    const cart = this._shoppingCartRepository.getById(cartId)
    cart.removeItem(ShoppingCartItem.fromData(item))
    this._shoppingCartRepository.update(cart)
  }

  public checkOut(id: UUID): void {
    const cart = this._shoppingCartRepository.getById(id)
    cart.checkOut()
    this._shoppingCartRepository.delete(id)
  }
}
