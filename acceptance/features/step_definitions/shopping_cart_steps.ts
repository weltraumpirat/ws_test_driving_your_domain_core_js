import {
  Given,
  TableDefinition,
  Then,
  When
} from 'cucumber'
// @ts-ignore

Given(/^the following available products:$/, function (table: TableDefinition) {
})
Given(/^the empty shopping cart$/, function () {
})
Given(/^the shopping cart contains the following items:$/, function (table: TableDefinition) {
})
When(/^I add the following item:$/, function (table: TableDefinition) {
})
When(/^I remove the following item:$/, function (table: TableDefinition) {
})
When(/^I proceed to check out$/, function () {
})
Then(/^the shopping cart is empty$/, function () {
})
Then(/^the shopping cart contains (\d+) item$/, function (count: number) {
})
Then(/^the first item is "([^"]*)"$/, function (itemName: string) {
})
Then(/^the following order with id "([^"]*)" and a total amount due of "([^"]*)" is created:$/, function (id: string, price: string, table: TableDefinition) {
})

