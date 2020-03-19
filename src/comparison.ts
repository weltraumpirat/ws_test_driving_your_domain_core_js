import {
  Order,
  OrderPosition
} from './domain/order'

export function equalPositionIgnoringIds(one: OrderPosition, two: OrderPosition): boolean {
  return one.itemName === two.itemName
    && one.count === two.count
    && one.singlePrice === two.singlePrice
}

export function equalPositions(one: OrderPosition[], two: OrderPosition[]): boolean {
  for (let i = 0; i < one.length; i++) {
    if (!equalPositionIgnoringIds(one[i], two[i])) {
      return false
    }
  }
  return true
}

export function equalOrderIgnoringIds(one: Order, two: Order): boolean {
  return one.total === two.total
    && equalPositions(one.positions, two.positions)
}
