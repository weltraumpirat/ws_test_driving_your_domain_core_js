// @ts-ignore
import uuid from 'uuid/v4'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {UUID} from '../../types'
import {Aggregate} from '../aggregate'
import {Global} from '../../global'
import {toData} from '../../conversion'
import {
  SHOPPING_CART_CHECKED_OUT,
  SHOPPING_CART_CREATED,
  SHOPPING_CART_ITEM_ADDED,
  SHOPPING_CART_ITEM_REMOVED
} from './shoppingcart_messages'
import {ShoppingCartData} from './shoppingcart_fixture'

export class ShoppingCartItem {
  public readonly id: UUID
  public readonly name: string
  public readonly label: string
  public readonly packagingType: string
  public readonly amount: string
  public readonly price: string

  private constructor(
    id: UUID,
    name: string,
    packagingType: string,
    amount: string,
    price: string) {
    this.price = price
    this.amount = amount
    this.packagingType = packagingType
    this.name = name
    this.id = id
    this.label =  `${this.name}, ${this.amount} ${this.packagingType}`
  }

  public static create(
    name: string,
    packagingType: string,
    amount: string,
    price: string): ShoppingCartItem {
    return new ShoppingCartItem(uuid(), name, packagingType, amount, price)
  }

  public static restore(
    id: UUID,
    name: string,
    packagingType: string,
    amount: string,
    price: string): ShoppingCartItem {
    return new ShoppingCartItem(id, name, packagingType, amount, price)
  }

  public static fromData( data: ShoppingCartItemData): ShoppingCartItem {
    return ShoppingCartItem.restore(data.id, data.name, data.packagingType, data.amount, data.price)
  }
}

export class ShoppingCart extends Aggregate {
  public items: ShoppingCartItem[]

  private constructor(id: UUID, items: ShoppingCartItem[] = []) {
    super(id, Global.eventbus)
    this.items = items
    const data: ShoppingCartData = toData(this)
    this._eventbus.dispatch({type: SHOPPING_CART_CREATED, payload: data})
  }

  public addItem(item: ShoppingCartItem): void {
    this.items.push(item)
    const cartData: ShoppingCartData = toData(this)
    this._eventbus.dispatch({type: SHOPPING_CART_ITEM_ADDED, payload: cartData})
  }

  public removeItem(item: ShoppingCartItem): void {
    this.items = this.items.filter((i: ShoppingCartItem): boolean => i.id !== item.id)
    const cartData: ShoppingCartData = toData(this)
    this._eventbus.dispatch({type: SHOPPING_CART_ITEM_REMOVED, payload: cartData})
  }


  public get empty(): boolean {
    return this.items.length === 0
  }

  public static createEmpty(): ShoppingCart {
    return new ShoppingCart(uuid())
  }

  public static createWithItems(...items: ShoppingCartItem[]): ShoppingCart {
    return new ShoppingCart(uuid(),[...items])
  }

  public static restore(id: UUID, items: ShoppingCartItem[] = []): ShoppingCart {
    return new ShoppingCart(id, items)
  }

  public checkOut(): void {
    const cartData: ShoppingCartData = toData(this)
    this._eventbus.dispatch({type: SHOPPING_CART_CHECKED_OUT, payload: cartData})

  }
}

export interface ShoppingCartRepository {
  findById(id: string): ShoppingCart

  create(cart: ShoppingCart): void

  update(cart: ShoppingCart): void
}
