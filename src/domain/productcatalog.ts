import {Product} from './product'

export interface ProductRepository {
  findAll(): Product[]

  create(product: Product): string
}

export class ProductCatalog {
  private _repository: ProductRepository

  public constructor(repository: ProductRepository) {
    this._repository = repository
  }

  public get products(): Product[] {
    return this._repository.findAll()
  }

  public static create(repository: ProductRepository): ProductCatalog {
    return new ProductCatalog(repository)
  }
}
