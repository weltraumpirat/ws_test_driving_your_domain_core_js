import {
    Given,
    TableDefinition,
    Then,
    When
} from 'cucumber'
import {Product} from "../../../src/domain/Product"
import {ShoppingCart} from "../../../src/domain/ShoppingCart"
import expect from 'expect';

function rowToProduct(columns: string[]) {
    return new Product(columns[0], columns[1], columns[2], columns[3])
}

function getProductsFromTable(table: TableDefinition) {
    return table.rows().map(rowToProduct)
}


Given(/^the following available products:$/, function (table: TableDefinition) {
    this.product = getProductsFromTable(table)
})
Given(/^the empty shopping cart$/, function () {
    this.shoppingCart = new ShoppingCart([])
})
Given(/^the shopping cart contains the following items:$/, function (table: TableDefinition) {
    this.shoppingCart = new ShoppingCart(getProductsFromTable(table))
})
When(/^I add the following item:$/, function (table: TableDefinition) {

})
When(/^I remove the following item:$/, function (table: TableDefinition) {
    this.shoppingCart.remove(getProductsFromTable(table))
})
When(/^I proceed to check out$/, function () {

})
Then(/^the shopping cart is empty$/, function () {
    console.log(JSON.stringify(this.shoppingCart));
    expect(this.shoppingCart.products.length).toBe(0)
})
Then(/^the shopping cart contains (\d+) item$/, function (count: number) {

})
Then(/^the first item is "([^"]*)"$/, function (itemName: string) {

})
Then('the following order with a total amount due of "([^"]*)" is created:', function (price: string) {

})
