import {Product} from "./Product"

export class ShoppingCart {
    private constructor(private _products: Product[]) {
    }

    public static createEmpty() {
        return new ShoppingCart([])
    }

    get products() {
        return this._products.slice();
    }

    addProducts(products: Product[]) {
        this._products.push(...products)
    }

    removeProduct(product: Product) {
        this._products = this._products.filter(value => JSON.stringify(value) !== JSON.stringify(product));
    }
}
