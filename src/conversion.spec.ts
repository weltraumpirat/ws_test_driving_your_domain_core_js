import {
  toData,
  toJson
} from './conversion'

describe('toData:', () => {
  it('should convert any string to equal string', () => {
    expect(toData('string')).toEqual('string')
  })
  it('should convert any number to equal number', () => {
    expect(toData(1)).toEqual(1)
  })
  it('should convert any Date to equal Date', () => {
    expect(toData(new Date(0))).toEqual(new Date(0))
  })
  it('should convert any array to equal array', () => {
    expect(toData(['0', 0, {}])).toEqual(['0', 0, {}])
  })
  it('should convert any object to serialized object without private fields', () => {
    expect(toData({public: 'public', _private: 'private'})).toEqual({public: 'public'})
  })
})

describe('toJson:', () => {
  it('should serialize objects to Json', () => {
    expect(toJson({'one': 'one'})).toEqual('{"one":"one"}')
  })
})
