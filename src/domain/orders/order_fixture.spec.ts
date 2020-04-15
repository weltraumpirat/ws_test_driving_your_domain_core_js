import {
  OrderPosition,
  OrderRepository
} from './order'
import {
  CREATE_ORDER,
  ORDER_CREATED
} from './order_messages'
import {Global} from '../../global'
import {
  Event,
  Eventbus
} from '../../eventbus'
import {OrderFixture} from './order_fixture'
import {OrderRepositoryInMemory} from '../../persistence/order_repository'

const objectContaining = jasmine.objectContaining

describe('OrderFixture', () => {
  const eventbus: Eventbus = Global.eventbus
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let fixture: OrderFixture
  let repository: OrderRepository
  let events: Event[]

  beforeEach(() => {
    events = []
    eventbus.subscribe('*', ev => events.push(ev))
    repository = new OrderRepositoryInMemory()
    fixture = new OrderFixture(repository)
  })

  describe('when an empty order is created', () => {
    beforeEach(() => {
      eventbus.dispatch({type: CREATE_ORDER, payload: {positions: []}})
    })

    it('should store the new order in repository', () => {
      expect(repository.findAll()).toHaveLength(1)
    })
  })

  describe('when an order with a position is created', () => {
    const position = OrderPosition.restore(
      '1',
      'Whole Milk, 1l Carton',
      1,
      '1.19 EUR',
      '1.19 EUR'
    )
    beforeEach(() => {
      Global.eventbus.dispatch({type: CREATE_ORDER, payload: {positions: [position]}})
    })

    it('should store the new order in repository', () => {
      expect(repository.findAll()).toHaveLength(1)
    })
    it('saved order should contain the order position', () => {
      expect(repository.findAll()[0].positions[0]).toEqual(position)
    })
    it(`should dispatch ${ORDER_CREATED}`, () => {
      expect(events).toContainEqual(objectContaining({type: ORDER_CREATED}))
    })
  })
  afterEach(() => {
    eventbus.release()
  })
})
