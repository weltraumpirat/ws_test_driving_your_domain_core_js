import {ShoppingCartItemData} from '../../api/shoppingcarts_api'
import {OrderPositionData} from '../../api/orders_api'
import {Service} from '../abstract_types'
import {Global} from '../../global'
import {SHOPPING_CART_CHECKED_OUT} from '../shoppingcarts/shoppingcart_messages'
import {
  Event,
  Eventbus
} from '../../eventbus'
import {CREATE_ORDER} from './order_messages'


type ItemCountMap = Map<string, { count: number, price: string }>

const addItemEntry = (map: ItemCountMap, item: ShoppingCartItemData): ItemCountMap => {
  map.set(item.label || item.name, {count: 1, price: item.price})
  return map
}

const increaseItemCount = (map: ItemCountMap, item: ShoppingCartItemData): ItemCountMap => {
  const value = map.get(item.label || item.name)
  if (value && value.count) value.count++
  return map
}

const countItem = (map: ItemCountMap, item: ShoppingCartItemData): ItemCountMap => {
  return map.has(item.label || item.name) ? increaseItemCount(map, item) : addItemEntry(map, item)
}

const countItems = (items: ShoppingCartItemData[]): ItemCountMap => items.reduce(countItem, new Map())

export class CheckoutPolicyService extends Service {
  public constructor(eventbus: Eventbus = Global.eventbus) {
    super(eventbus)
    this._eventbus.subscribe(SHOPPING_CART_CHECKED_OUT, this.receiveEvent.bind(this))
  }

  private receiveEvent(event: Event): void {
    switch (event.type) {
      case SHOPPING_CART_CHECKED_OUT:
        this.checkOut(event.payload.items)
        break
    }
  }

  private checkOut(items: ShoppingCartItemData[]): void {
    const itemCounts = countItems(items)
    const positions: OrderPositionData[] = []
    itemCounts.forEach((value, key) => {
      const combined = value.count * parseFloat(value.price)
      positions.push({itemName: key, count: value.count, singlePrice: value.price, combinedPrice: combined + ' EUR'})
    })
    this._eventbus.dispatch({type: CREATE_ORDER, payload: {positions}})
  }
}


