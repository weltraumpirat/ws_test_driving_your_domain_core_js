// @ts-ignore
import uuid from "uuid/v4"

export class ShoppingCartItem {
    private constructor(
      public readonly id: string,
      public readonly name: string,
      public readonly packagingType: string,
      public readonly amount: string,
      public readonly price: string) {
    }

    public static create(
      name: string,
      packagingType: string,
      amount: string,
      price: string) {
       return new ShoppingCartItem(uuid(), name, packagingType, amount, price)
    }
    public static restore(
      id: string,
      name: string,
      packagingType: string,
      amount: string,
      price: string) {
        return new ShoppingCartItem(id, name, packagingType, amount, price)
    }
}

export class ShoppingCart {
    private constructor(private _items: ShoppingCartItem[]) {
    }

    public static createEmpty() {
        return new ShoppingCart([])
    }

    public static createWithItems(...items: ShoppingCartItem[]) {
        return new ShoppingCart([...items])
    }

    public addItem( item: ShoppingCartItem) {
        this._items.push(item)
    }

    removeItem(item: ShoppingCartItem) {
        this._items = this._items.filter(i => i.id !== item.id)
    }

    get items() {
        return this._items.slice();
    }

    get empty() {
        return this._items.length === 0
    }
}
