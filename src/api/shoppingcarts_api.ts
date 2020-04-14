import {ShoppingCartFixture} from '../domain/shoppingcarts/shoppingcart_fixture'
import {ShoppingCartItemsReadModel} from '../domain/shoppingcarts/shoppingcart_items_readmodel'
import {ShoppingCartItemCountReadModel} from '../domain/shoppingcarts/shoppingcart_itemcount_readmodel'
import {ShoppingCartEmptyReadModel} from '../domain/shoppingcarts/shoppingcart_empty_readmodel'
import {UUID} from '../types'
import {
  ADD_ITEM_TO_SHOPPING_CART,
  CHECK_OUT_SHOPPING_CART,
  CREATE_SHOPPING_CART,
  REMOVE_ITEM_FROM_SHOPPING_CART,
  SHOPPING_CART_CREATED,
  SHOPPING_CART_ITEM_ADDED,
  SHOPPING_CART_ITEM_REMOVED
} from '../domain/shoppingcarts/shoppingcart_messages'
import {Global} from '../global'
import {OrderData} from './orders_api'
import {ORDER_CREATED} from '../domain/orders/order_messages'

export interface ShoppingCartItemData {
  id: string
  name: string
  label?: string
  packagingType: string
  amount: string
  price: string
}

export class ShoppingCartsApi {
  private _fixture: ShoppingCartFixture
  private _shoppingCartItemsReadModel: ShoppingCartItemsReadModel
  private _shoppingCartItemCountReadModel: ShoppingCartItemCountReadModel
  private _shoppingCartEmptyReadModel: ShoppingCartEmptyReadModel

  public constructor(fixture: ShoppingCartFixture, itemsReadModel: ShoppingCartItemsReadModel, itemCountReadModel: ShoppingCartItemCountReadModel, emptyReadModel: ShoppingCartEmptyReadModel) {
    this._fixture = fixture
    this._shoppingCartItemsReadModel = itemsReadModel
    this._shoppingCartItemCountReadModel = itemCountReadModel
    this._shoppingCartEmptyReadModel = emptyReadModel
  }

  public createEmptyShoppingCart(): Promise<UUID> {
    return this.createShoppingCartWithItems()
  }

  public createShoppingCartWithItems(...items: ShoppingCartItemData[]): Promise<UUID> {
    return new Promise<UUID>(resolve => {
      Global.eventbus.subscribeOnce(SHOPPING_CART_CREATED, ev => resolve(ev.payload.id))
      Global.eventbus.dispatch({type: CREATE_SHOPPING_CART, payload: items})
    })
  }

  public addItemToShoppingCart(id: UUID, item: ShoppingCartItemData): Promise<void> {
    return new Promise<void>(resolve => {
      Global.eventbus.subscribeOnce(SHOPPING_CART_ITEM_ADDED, () => resolve())
      Global.eventbus.dispatch({type: ADD_ITEM_TO_SHOPPING_CART, payload: {id, item}})
    })
  }

  public removeItemFromShoppingCart(id: UUID, item: ShoppingCartItemData): Promise<void> {
    return new Promise<void>(resolve => {
      Global.eventbus.subscribeOnce(SHOPPING_CART_ITEM_REMOVED, () => resolve())
      Global.eventbus.dispatch({type: REMOVE_ITEM_FROM_SHOPPING_CART, payload: {id, item}})
    })
  }

  public checkOut(id: UUID): Promise<OrderData> {
    return new Promise<OrderData>(resolve => {
      Global.eventbus.subscribeOnce(ORDER_CREATED, ev => resolve(ev.payload))
      Global.eventbus.dispatch({type: CHECK_OUT_SHOPPING_CART, payload: id})
    })
  }

  public getShoppingCartItems(id: string): ShoppingCartItemData[] {
    return this._shoppingCartItemsReadModel.getItems(id)
  }

  public getShoppingCartItemCount(id: string): number {
    return this._shoppingCartItemCountReadModel.getItemCount(id)
  }

  public isShoppingCartEmpty(id: string): boolean {
    return this._shoppingCartEmptyReadModel.isEmpty(id)
  }
}
