import {ShoppingCartItem} from './ShoppingCart'
import {
  Order,
  OrderPosition
} from './Order'

export class CheckoutService {
  public checkOut(items: ShoppingCartItem[]): Order {
    const sum: Map<string, [number, string]> = items.reduce((m: Map<string, [number, string]>, item): Map<string, [number, string]> => {
      console.log(m, item.name, m.has(item.name))
      const positionName = `${item.name}, ${item.amount} ${item.packagingType}`
      if (m.has(positionName))
        {
          const value = m.get(positionName)
          if(value && value[0]) value[0]++
        }
      else m.set(positionName, [1, item.price])
      return m
    }, new Map())
    const positions: OrderPosition[] = []
    sum.forEach((value, key) => {
      const combined = value[0] * parseFloat(value[1])
      positions.push(OrderPosition.create(key, value[0], value[1], combined + ' EUR'))
    })
    return Order.create(...positions)
  }
}


