export class Product {
  public readonly name: string
  public readonly packagingType: string
  public readonly price: string
  public readonly amount: string

  public constructor(name: string,
    packagingType: string,
    amount: string,
    price: string) {
    this.amount = amount
    this.price = price
    this.packagingType = packagingType
    this.name = name
  }

  public static withName(name: string): Product {
    return new Product(name, '', '', '')
  }
}
