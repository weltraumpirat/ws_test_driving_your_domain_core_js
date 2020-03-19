import {ShoppingCartItem} from './shoppingcart'
import {
  Order,
  OrderPosition
} from './order'


type ItemEntry = Map<string, { count: number, price: string }>

const addItemEntry = (m: ItemEntry, item: ShoppingCartItem): ItemEntry => {
  m.set(item.label, {count: 1, price: item.price})
  return m
}

const increaseItemCount = (m: ItemEntry, item: ShoppingCartItem): ItemEntry => {
  const value = m.get(item.label)
  if (value && value.count) value.count++
  return m
}

const countItem = (m: ItemEntry, item: ShoppingCartItem): ItemEntry => {
  return m.has(item.label) ? increaseItemCount(m, item) : addItemEntry(m, item)
}

const countItems = (items: ShoppingCartItem[]): ItemEntry => items.reduce(countItem, new Map())

export class CheckoutService {
  public checkOut(items: ShoppingCartItem[]): Order {
    const itemCounts = countItems(items)
    const positions: OrderPosition[] = []
    itemCounts.forEach((value, key) => {
      const combined = value.count * parseFloat(value.price)
      positions.push(OrderPosition.create(key, value.count, value.price, combined + ' EUR'))
    })
    return Order.create(...positions)
  }
}


