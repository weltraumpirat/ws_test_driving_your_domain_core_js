import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {toData} from '../../conversion'
import {ShoppingCartItem} from './shoppingcart'
import {PackagingType} from '../products/product'
import {ShoppingCartEmptyReadModel} from './shoppingcart_empty_readmodel'

const ITEM = ShoppingCartItem.fromData(
  {
    id: '1',
    name: 'Whole Milk',
    packagingType: PackagingType.CARTON,
    amount: '1L',
    price: '1.19 EUR'
  }
)
describe('ShoppingCartEmptyReadModel', () => {
  let readModel: ShoppingCartEmptyReadModel
  const ID = '1'
  beforeEach(() => {
    readModel = new ShoppingCartEmptyReadModel()
  })
  describe('when creating an empty Shopping Cart', () => {
    beforeEach(() => {
      readModel.notifyCartCreated({id: ID, items: []})
    })

    it('should consider the cart empty', () => {
      expect(readModel.isEmpty(ID)).toBe(true)
    })

    it('should not consider unknown ShoppingCarts empty', () => {
      expect(readModel.isEmpty('unknown')).toBe(false)
    })

    describe('and an item is added', () => {
      let itemData: ShoppingCartItemData

      beforeEach(() => {
        itemData = toData(ITEM)
        readModel.notifyItemAdded({id: ID, items: [itemData]})
      })

      it('not consider the cart empty', () => {
        expect(readModel.isEmpty(ID)).toBe(false)
      })

      describe('and the last existing item is removed', () => {
        beforeEach(() => {
          readModel.notifyItemRemoved({id: ID, items: []})
        })

        it('should consider the cart empty', () => {
          expect(readModel.isEmpty(ID)).toBe(true)
        })
      })

      describe('and the cart is checked out', () => {
        beforeEach(() => {
          readModel.notifyCheckedOut({id: ID, items: [itemData]})
        })

        it('should not consider the cart empty', () => {
          expect(readModel.isEmpty(ID)).toBe(false)
        })
      })
    })
  })
})



