import {
  Order,
  OrderPosition
} from './order'
import {ShoppingCartItemData} from '../api/shoppingcart_api'


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
  public checkOut(items: ShoppingCartItemData[]): Order {
    const itemCounts = countItems(items)
    const positions: OrderPosition[] = []
    itemCounts.forEach((value, key) => {
      const combined = value.count * parseFloat(value.price)
      positions.push(OrderPosition.create(key, value.count, value.price, combined + ' EUR'))
    })
    return Order.create(...positions)
  }
}


