import {setWorldConstructor} from 'cucumber'
import {Product} from "../../../src/domain/Product"
import {ShoppingCart} from "../../../src/domain/ShoppingCart"

class World {
    public products: Product[] = [];
    public shoppingCart: ShoppingCart = new ShoppingCart([]);
}

setWorldConstructor(World)
