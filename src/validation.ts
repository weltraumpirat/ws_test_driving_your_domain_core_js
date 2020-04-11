import {ProductData} from './api/products_api'
import {ShoppingCartItem} from './domain/shoppingcarts/shoppingcart'

export function validateShoppingCartItem(item: ShoppingCartItem, products: ProductData[]): void {
  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    if (item.id && p.name === item.name && p.amount === item.amount && p.packagingType == item.packagingType && p.price === item.price) return
  }
  throw new Error(`Item '${item.name}' is not a valid product.`)
}
