import {ShoppingCartItemsReadModel} from './shoppingcart_items_readmodel'
import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {toData} from '../../conversion'
import {ShoppingCartItem} from './shoppingcart'
import {PackagingType} from '../products/product'

const ITEM = ShoppingCartItem.fromData(
  {
    id: '1',
    name: 'Whole Milk',
    packagingType: PackagingType.CARTON,
    amount: '1L',
    price: '1.19 EUR'
  }
)
describe('ShoppingCartItemsReadModel', () => {
  let readModel: ShoppingCartItemsReadModel
  const ID = '1'
  beforeEach(() => {
    readModel = new ShoppingCartItemsReadModel()
  })
  describe('when creating an empty Shopping Cart', () => {
    beforeEach(() => {
      readModel.notifyCartCreated({id: ID, items: []})
    })

    it('should return no items for the cart', () => {
      expect(readModel.getItems(ID)).toEqual([])
    })

    it('should throw when querying unknown ShoppingCart items', () => {
      expect(() => readModel.getItems('unknown')).toThrow()
    })

    describe('and an item is added', () => {
      let itemData: ShoppingCartItemData
      beforeEach(() => {
        itemData = toData(ITEM)
        readModel.notifyItemAdded({id: ID, items: [itemData]})
      })
      it('should store the item', () => {
        expect(readModel.getItems(ID)).toEqual([itemData])
      })
      describe('and the existing item is removed', () => {
        beforeEach(() => {
          readModel.notifyItemRemoved({id: ID, items: []})
        })

        it('should return no items', () => {
          expect(readModel.getItems('1')).toEqual([])
        })
      })
      describe('and the cart is checked out', () => {
        beforeEach(() => {
          readModel.notifyCheckedOut({id: ID, items: [itemData]})
        })
        it('should throw when querying items', () => {
          expect(() => readModel.getItems(ID)).toThrow()
        })
      })
    })
  })
})



