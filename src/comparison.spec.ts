import {equalOrderIgnoringIds} from './comparison'
import {OrderPositionData} from './api/orders_api'

describe('equalOrdersIgnoringIds', () => {
  it('should consider two Orders with different ids, but no positions equal', () => {
    expect(equalOrderIgnoringIds({id: '1', positions: []}, {id: '2', positions: []})).toBe(true)
  })

  it('should consider two Orders with different ids, but otherwise equal positions equal', () => {
    const position1: OrderPositionData = {id: '1', itemName: 'position1', count: 1, singlePrice: '1 EUR', combinedPrice: '1 EUR'}
    const position2: OrderPositionData = {...position1, id: '2'}
    expect(equalOrderIgnoringIds({id: '1', positions: [position1]}, {id: '2', positions: [position2]})).toBe(true)
  })

  it('should not consider two Orders with positions of different itemNames equal', () => {
    const position1: OrderPositionData = {id: '1', itemName: 'position1', count: 1, singlePrice: '1 EUR', combinedPrice: '1 EUR'}
    const position2: OrderPositionData = {...position1, id: '2', itemName: 'position2'}
    expect(equalOrderIgnoringIds({id: '1', positions: [position1]}, {id: '2', positions: [position2]})).toBe(false)
  })
  it('should not consider two Orders with positions of different counts equal', () => {
    const position1: OrderPositionData = {id: '1', itemName: 'position1', count: 1, singlePrice: '1 EUR', combinedPrice: '1 EUR'}
    const position2: OrderPositionData =  {...position1, id: '2', count: 2}
    expect(equalOrderIgnoringIds({id: '1', positions: [position1]}, {id: '2', positions: [position2]})).toBe(false)
  })
  it('should not consider two Orders with positions of different singlePrice equal', () => {
    const position1: OrderPositionData = {id: '1', itemName: 'position1', count: 1, singlePrice: '1 EUR', combinedPrice: '1 EUR'}
    let position2: OrderPositionData = {...position1, id: '2', singlePrice: '2 EUR'}
    expect(equalOrderIgnoringIds({id: '1', positions: [position1]}, {id: '2', positions: [position2]})).toBe(false)
  })
  it('should consider two Orders with positions of different totalPrice equal (total is calculated, should be ignored)', () => {
    const position1: OrderPositionData = {id: '1', itemName: 'position1', count: 1, singlePrice: '1 EUR', combinedPrice: '1 EUR'}
    let position2: OrderPositionData = {...position1, id: '2', combinedPrice: '5 EUR'}
    expect(equalOrderIgnoringIds({id: '1', positions: [position1]}, {id: '2', positions: [position2]})).toBe(true)
  })
})
