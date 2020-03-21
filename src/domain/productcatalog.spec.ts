import {ProductCatalog} from './productcatalog'
import {
  PackagingType,
  Product
} from './product'
import {ProductRepositoryInMemory} from '../persistence/product_repository'

describe('ProductCatalog', ()=> {
  it('should create an empty catalog', ()=> {
    expect(ProductCatalog.create(new ProductRepositoryInMemory())).toBeDefined()
  })

  it('should create a catalog with products', ()=> {
    const product = new Product('1', 'Product', PackagingType.PACK, '10', '1.00 EUR')
    const catalog = ProductCatalog.create(new ProductRepositoryInMemory([product]))
    expect(catalog).toBeDefined()
    expect(catalog.products).toEqual([product])
  })
})
