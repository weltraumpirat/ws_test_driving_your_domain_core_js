import {
  Given,
  TableDefinition,
  Then,
  When
} from 'cucumber'
import {Product} from '../../../src/domain/Product'
// @ts-ignore
import expect from 'expect'
import {ShoppingCartItem} from '../../../src/domain/ShoppingCart'
import {OrderPosition} from '../../../src/domain/Order'
import {equalPositions} from '../../../src/comparison'

function rowToProduct(columns: string[]) {
  return new Product(columns[0], columns[1], columns[2], columns[3])
}

function createItemFromTableRow(columns: string[]) {
  return ShoppingCartItem.restore(columns[0], columns[1], columns[2], columns[3], columns[4])
}

function createOrderPositionFromTableRow(columns: string[]) {
  return OrderPosition.restore(columns[0], columns[1], parseInt(columns[2]), columns[3], columns[4])
}

function getProductsFromTable(table: TableDefinition) {
  return table.rows().map(rowToProduct)
}

function createItemsFromTableRows(table: TableDefinition) {
  return table.rows().map(createItemFromTableRow)
}

function createOrderPositionsFromTableRows(table: TableDefinition): OrderPosition[] {
  return table.rows().map(createOrderPositionFromTableRow)
}

Given(/^the following available products:$/, function (table: TableDefinition) {
  this.products = getProductsFromTable(table)
})
Given(/^the empty shopping cart$/, function () {
  this.shoppingCartApi.createEmptyShoppingCart()
})
Given(/^the shopping cart contains the following items:$/, function (table: TableDefinition) {
  const items = createItemsFromTableRows(table)
  this.shoppingCartApi.createShoppingCartWithItems(...items)
})
When(/^I add the following item:$/, function (table: TableDefinition) {
  const item = createItemsFromTableRows(table)[0]
  this.shoppingCartApi.addItemToShoppingCart(item)
})
When(/^I remove the following item:$/, function (table: TableDefinition) {
  const item = createItemsFromTableRows(table)[0]
  this.shoppingCartApi.removeItemFromShoppingCart(item)
})
When(/^I proceed to check out$/, function () {
  this.order = this.shoppingCartApi.checkOut()
})
Then(/^the shopping cart is empty$/, function () {
  expect(this.shoppingCartApi.isShoppingCartEmpty()).toBe(true)
})
Then(/^the shopping cart contains (\d+) item$/, function (count: number) {
  expect(this.shoppingCartApi.getShoppingCartItemCount()).toEqual(count)
})
Then(/^the first item is "([^"]*)"$/, function (itemName: string) {
  expect((this.shoppingCartApi.getShoppingCartItems()[0]).name).toEqual(itemName)
})
Then(/^the following order with id "([^"]*)" and a total amount due of "([^"]*)" is created:$/, function (id: string, price: string, table: TableDefinition) {
  const positions = createOrderPositionsFromTableRows(table)
  console.log(this.order)
  expect(this.order.total).toEqual(price)

  expect(equalPositions(this.order.positions, positions)).toBe(true)
})

