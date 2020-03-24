import {ProductData} from '../../api/products_api'
import uuid from 'uuid/v4'
import {ensure} from '../../types'
import {Aggregate} from '../aggregate'
import {
  Global
} from '../../global'

export enum PackagingType {
  CARTON = 'Carton',
  LOAF = 'Loaf',
  PACK = 'Pack'
}

export class Product extends Aggregate {
  public readonly name: string
  public readonly packagingType: PackagingType
  public readonly price: string
  public readonly amount: string

  public constructor(
    id: string,
    name: string,
    packagingType: PackagingType,
    amount: string,
    price: string) {
    super(id, Global.eventbus)
    this.amount = amount
    this.price = price
    this.packagingType = packagingType
    this.name = name
  }

  public static fromData(data: ProductData): Product {
    return new Product(ensure(data.id), data.name, data.packagingType, data.amount, data.price)
  }

  public static create(name: string, packagingType: PackagingType, amount: string, price: string): Product {
    return new Product(uuid(), name, packagingType, amount, price)
  }
}
