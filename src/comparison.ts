import {
  Order,
  OrderPosition
} from './domain/Order'

export function equalPositionIgnoringIds(one: OrderPosition, two: OrderPosition): boolean {
  return one.itemName === two.itemName && one.count === two.count && one.singlePrice === two.singlePrice
}

export function equalOrderIgnoringIds(one: Order, two: Order): boolean {
  return one.total === two.total && equalPositions(one.positions, two.positions)
}

export function equalPositions(one: OrderPosition[], two: OrderPosition[]) {
  let equal = true
  for (let i = 0; i < one.length; i++)
    if (!equalPositionIgnoringIds(one[i], two[i])) {
      console.log(one[i], two[i])
      equal = false
    }
  return equal
}
