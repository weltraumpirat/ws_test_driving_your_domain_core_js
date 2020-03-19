import {setWorldConstructor} from 'cucumber'
import {Product} from '../../../src/domain/product'
import {ShoppingCartApi} from '../../../src/api/shoppingcart_api'

class World {
    public products: Product[] = [];
    public shoppingCartApi: ShoppingCartApi = new ShoppingCartApi();
}

setWorldConstructor(World)
