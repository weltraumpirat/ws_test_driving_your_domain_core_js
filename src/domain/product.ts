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
}
