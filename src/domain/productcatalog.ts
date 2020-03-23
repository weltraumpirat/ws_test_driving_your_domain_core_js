import {Product} from './product'

export interface ProductRepository {
  findAll(): Product[]

  create(product: Product): void
}

export class ProductCatalog {
  private _repository: ProductRepository

  public constructor(repository: ProductRepository) {
    this._repository = repository
  }

  public get products(): Product[] {
    return this._repository.findAll()
  }
  public addProduct(product: Product): void {
    this._repository.create(product)
  }

  public static create(repository: ProductRepository): ProductCatalog {
    return new ProductCatalog(repository)
  }
}
