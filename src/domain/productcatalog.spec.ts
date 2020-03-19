import {ProductCatalog} from './productcatalog'
import {
  PackagingType,
  Product
} from './product'

describe('ProductCatalog', ()=> {
  it('should create an empty catalog', ()=> {
    expect(ProductCatalog.createEmpty()).toBeDefined()
  })

  it('should create a catalog with products', ()=> {
    const product = new Product('Product', PackagingType.PACK, '10', '1.00 EUR')
    const catalog = ProductCatalog.createWithProducts([product])
    expect(catalog).toBeDefined()
    expect(catalog.products).toEqual([product])
  })
})
