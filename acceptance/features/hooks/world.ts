import {setWorldConstructor} from 'cucumber'
import {Product} from '../../../src/domain/Product'
import {ShoppingCartApi} from '../../../src/api/shoppingcart_api'
import {OrdersApi} from '../../../src/api/orders_api'

class World {
    public products: Product[] = [];
    public shoppingCartApi: ShoppingCartApi = new ShoppingCartApi();
    public ordersApi: OrdersApi = new OrdersApi()
}

setWorldConstructor(World)
