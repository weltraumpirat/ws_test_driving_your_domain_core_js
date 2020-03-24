import {
  Eventbus,
  Listener,
  Message,
  SimpleEventbus
} from './eventbus'
import {ensure} from './types'

describe('Eventbus:', () => {
  describe('when bus has subscribed observers', () => {
    let bus: Eventbus
    let result: Message | undefined
    const listener: Listener = (event: Message): void => {
      result = event
    }

    beforeEach(() => {
      result = undefined
      bus = new SimpleEventbus()
      bus.subscribe('test', listener)
    })

    it('should notify subscribed specific observers', () => {
      bus.dispatch({type: 'test'})
      expect(ensure(result).type).toEqual('test')
    })

    it('should not notify unsubscribed specific observers', () => {
      bus.unsubscribe('test', listener)
      bus.dispatch({type: 'test'})
      expect(result).toBeUndefined()
    })

    it('should notify subscribed global observers', () => {
      bus.subscribe('*', listener)
      bus.dispatch({type: 'someUnobservedType'})
      expect(ensure(result).type).toEqual('someUnobservedType')
    })

    it('should release all observers', () => {
      bus.subscribe('*', listener)
      bus.release()
      bus.dispatch({type: 'any event'})
      expect(result).toBeUndefined()
    })
  })
})
