// @ts-ignore
import uuid from 'uuid/v4'
import {ShoppingCartItemData} from '../api/shoppingcart_api'

export class ShoppingCartItem {
  public readonly id: string
  public readonly name: string
  public readonly label: string
  public readonly packagingType: string
  public readonly amount: string
  public readonly price: string

  private constructor(
    id: string,
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
    id: string,
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

export class ShoppingCart {
  private _items: ShoppingCartItem[]

  private constructor(_items: ShoppingCartItem[]) {
    this._items = _items
  }

  public static createEmpty(): ShoppingCart {
    return new ShoppingCart([])
  }

  public static createWithItems(...items: ShoppingCartItem[]): ShoppingCart {
    return new ShoppingCart([...items])
  }

  public addItem(item: ShoppingCartItem): void {
    this._items.push(item)
  }

  public removeItem(item: ShoppingCartItem): void {
    this._items = this._items.filter((i: ShoppingCartItem): boolean => i.id !== item.id)
  }

  public get items(): ShoppingCartItem[] {
    return this._items.slice()
  }

  public get empty(): boolean {
    return this._items.length === 0
  }
}
