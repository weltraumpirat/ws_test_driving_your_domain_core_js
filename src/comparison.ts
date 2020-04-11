import {OrderPosition} from './domain/orders/order'
import {toData} from './conversion'
import {OrderData} from './domain/shoppingcarts/shoppingcart_fixture'

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

export function equalOrderIgnoringIds(one: OrderData, two: OrderData): boolean {
  return one.total === two.total
    && equalPositions(one.positions, two.positions)
}

export function expectEqualData<T>(actual: T, expected: T): void {
  expect(toData(actual)).toEqual(toData(expected))
}
