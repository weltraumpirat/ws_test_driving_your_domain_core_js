import {
  Given,
  TableDefinition,
  Then,
  When
} from 'cucumber'
// @ts-ignore
import expect from 'expect'
import {equalPositions} from '../../../src/comparison'
import {
  tableRowsToItems,
  tableRowsToOrderPositions,
  tableRowsToProducts
} from '../helpers/table_conversion'

Given(/^the following available products:$/, function (table: TableDefinition) {
  this.productsApi.createCatalogWithProducts(tableRowsToProducts(table))
})
Given(/^the empty shopping cart$/, function () {
  this.cartId = this.shoppingCartApi.createEmptyShoppingCart()
})
Given(/^the shopping cart contains the following items:$/, function (table: TableDefinition) {
  const items = tableRowsToItems(table)
  this.cartId = this.shoppingCartApi.createShoppingCartWithItems(...items)
})
When(/^I add the following item:$/, function (table: TableDefinition) {
  const item = tableRowsToItems(table)[0]
  this.shoppingCartApi.addItemToShoppingCart(this.cartId, item)
})
When(/^I remove the following item:$/, function (table: TableDefinition) {
  const item = tableRowsToItems(table)[0]
  this.shoppingCartApi.removeItemFromShoppingCart(this.cartId, item)
})
When(/^I proceed to check out$/, function () {
  this.order = this.shoppingCartApi.checkOut(this.cartId)
})
Then(/^the shopping cart is empty$/, function () {
  expect(this.shoppingCartApi.isShoppingCartEmpty(this.cartId)).toBe(true)
})
Then(/^the shopping cart contains (\d+) item$/, function (count: number) {
  expect(this.shoppingCartApi.getShoppingCartItemCount(this.cartId)).toEqual(count)
})
Then(/^the first item is "([^"]*)"$/, function (itemName: string) {
  expect((this.shoppingCartApi.getShoppingCartItems(this.cartId)[0]).name).toEqual(itemName)
})
Then(/^the following order with id "([^"]*)" and a total amount due of "([^"]*)" is created:$/, function (id: string, price: string, table: TableDefinition) {
  const positions = tableRowsToOrderPositions(table)
  const order = this.ordersReadModel.orders.values().next().value
  expect(order.total).toEqual(price)
  expect(equalPositions(order.positions, positions)).toBe(true)
})

