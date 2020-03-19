import {ShoppingCartItem} from './domain/shoppingcart'
import {Product} from './domain/product'

export function validateShoppingCartItem(item: ShoppingCartItem, products: Product[]): void {
  for (let i = 0; i < products.length; i++) {
    const p = products[i]
    if (p.name === item.name && p.amount === item.amount && p.packagingType == item.packagingType && p.price === item.price) return
  }
  throw new Error(`Item '${item.name}' is not a valid product.`)
}
