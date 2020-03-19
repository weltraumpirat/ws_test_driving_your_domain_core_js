import {OrderPosition} from '../../../src/domain/order'
import {
  PackagingType,
  Product
} from '../../../src/domain/product'
import {TableDefinition} from 'cucumber'
import {ShoppingCartItem} from '../../../src/domain/shoppingcart'

export const rowToProduct = (columns: string[]): Product => new Product(columns[0], columns[1] as PackagingType, columns[2], columns[3])

export const tableRowsToProducts = (table: TableDefinition): Product[] => table.rows().map(rowToProduct)

export const rowToItem = (columns: string[]): ShoppingCartItem => ShoppingCartItem.restore(columns[0], columns[1], columns[2], columns[3], columns[4])

export const tableRowsToItems = (table: TableDefinition): ShoppingCartItem[] => table.rows().map(rowToItem)

export const rowToOrderPosition = (columns: string[]): OrderPosition => OrderPosition.restore(columns[0], columns[1], parseInt(columns[2]), columns[3], columns[4])

export const tableRowsToOrderPositions = (table: TableDefinition): OrderPosition[] => table.rows().map(rowToOrderPosition)
