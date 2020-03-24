import {
  Order,
  OrderPosition
} from '../orders/order'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {OrdersApi} from '../../api/orders_api'


type ItemEntry = Map<string, { count: number, price: string }>

const addItemEntry = (m: ItemEntry, item: ShoppingCartItemData): ItemEntry => {
  m.set(item.label || item.name, {count: 1, price: item.price})
  return m
}

const increaseItemCount = (m: ItemEntry, item: ShoppingCartItemData): ItemEntry => {
  const value = m.get(item.label || item.name)
  if (value && value.count) value.count++
  return m
}

const countItem = (m: ItemEntry, item: ShoppingCartItemData): ItemEntry => {
  return m.has(item.label || item.name) ? increaseItemCount(m, item) : addItemEntry(m, item)
}

const countItems = (items: ShoppingCartItemData[]): ItemEntry => items.reduce(countItem, new Map())

export class CheckoutService {
  private _ordersApi: OrdersApi

  public constructor(ordersApi: OrdersApi) {
    this._ordersApi = ordersApi

  }

  public checkOut(items: ShoppingCartItemData[]): void {
    const itemCounts = countItems(items)
    const positions: OrderPosition[] = []
    itemCounts.forEach((value, key) => {
      const combined = value.count * parseFloat(value.price)
      positions.push(OrderPosition.create(key, value.count, value.price, combined + ' EUR'))
    })
    this._ordersApi.create(Order.create(...positions))
  }
}


