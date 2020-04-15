import {Product} from './product'
import {ProductData} from '../../api/products_api'
import {AggregateFixture} from '../abstract_types'
import {
  Command,
  Eventbus
} from '../../eventbus'
import {
  ADD_PRODUCT,
  ADD_PRODUCTS
} from './product_messages'
import {Global} from '../../global'
import {UUID} from '../../types'

export interface ProductRepository {
  findAll(): Product[]

  findById(id: UUID): Product | undefined

  create(product: Product): void
}

export class ProductFixture extends AggregateFixture {
  private _repository: ProductRepository

  public constructor(repository: ProductRepository, eventbus: Eventbus = Global.eventbus) {
    super(eventbus)
    this._repository = repository
    this._eventbus.subscribe(ADD_PRODUCT, this.receiveCommand.bind(this))
    this._eventbus.subscribe(ADD_PRODUCTS, this.receiveCommand.bind(this))
  }

  protected receiveCommand(command: Command): void {
    switch (command.type) {
      case ADD_PRODUCTS:
        this.addProducts(command.payload)
        break
      case ADD_PRODUCT:
        this.addProduct(command.payload)
        break
    }
  }

  private addProduct(data: ProductData): void {
    let product: Product
    if (!data.id) {
      product = Product.create(data.name, data.packagingType, data.amount, data.price)
    } else {
      product = Product.fromData(data)
    }
    if (!this._repository.findById(product.id))
      this.store(product)
  }

  private addProducts(data: ProductData[]): void {
    data.map(this.addProduct.bind(this))
  }

  private store(product: Product): void {
    this._repository.create(product)
  }
}
