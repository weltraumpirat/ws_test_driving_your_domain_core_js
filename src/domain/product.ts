import {ProductData} from '../api/productcatalog_api'

export enum PackagingType {
  CARTON = 'Carton',
  LOAF = 'Loaf',
  PACK = 'Pack'
}

export class Product {
  public readonly name: string
  public readonly packagingType: PackagingType
  public readonly price: string
  public readonly amount: string

  public constructor(name: string,
    packagingType: PackagingType,
    amount: string,
    price: string) {
    this.amount = amount
    this.price = price
    this.packagingType = packagingType
    this.name = name
  }

  public static fromData(data: ProductData): Product {
    return new Product(data.name, data.packagingType, data.amount, data.price)
  }
}
