import {toData} from './conversion'
import {
  OrderData,
  OrderPositionData
} from './api/orders_api'

export function equalPositionIgnoringIds(one: OrderPositionData, two: OrderPositionData): boolean {
  return one.itemName === two.itemName
    && one.count === two.count
    && one.singlePrice === two.singlePrice
}

export function equalPositions(one: OrderPositionData[], two: OrderPositionData[]): boolean {
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
