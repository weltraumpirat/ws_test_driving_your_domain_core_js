import {ShoppingCartItem} from './ShoppingCart'
import {
  Order,
  OrderPosition
} from './Order'

const addItemEntry = (m: Map<string, {count:number, price:string}>, item: ShoppingCartItem) => {
  m.set(item.label, {count: 1, price:item.price})
  return m
}
const increaseItemCount = (m: Map<string, {count:number, price:string}>, item: ShoppingCartItem) => {
  const value = m.get(item.label)
  if (value && value.count) value.count++
  return m
}
const countItem = (m: Map<string, {count:number, price:string}>, item: ShoppingCartItem): Map<string, {count:number, price:string}> => {
  return m.has(item.label) ? increaseItemCount(m, item) : addItemEntry(m, item)
}
const countItems = (items: ShoppingCartItem[]) => items.reduce(countItem, new Map())


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


