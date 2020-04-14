import {ShoppingCartFixture} from '../domain/shoppingcarts/shoppingcart_fixture'
import {ShoppingCartItemsReadModel} from '../domain/shoppingcarts/shoppingcart_items_readmodel'
import {ShoppingCartItemCountReadModel} from '../domain/shoppingcarts/shoppingcart_itemcount_readmodel'
import {ShoppingCartEmptyReadModel} from '../domain/shoppingcarts/shoppingcart_empty_readmodel'
import {UUID} from '../types'
import {
  CREATE_SHOPPING_CART,
  SHOPPING_CART_CREATED
} from '../domain/shoppingcarts/shoppingcart_messages'
import {Global} from '../global'

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
    return this._shoppingCartItemsReadModel.getItems(id)
  }

  public getShoppingCartItemCount(id: string): number {
    return this._shoppingCartItemCountReadModel.getItemCount(id)
  }

  public isShoppingCartEmpty(id: string): boolean {
    return this._shoppingCartEmptyReadModel.isEmpty(id)
  }
}
