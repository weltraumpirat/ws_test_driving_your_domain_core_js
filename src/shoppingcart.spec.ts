import {ShoppingCart} from "./domain/ShoppingCart"
import {Product} from "./domain/Product"

describe('Shopping Cart:', () => {
    it('should not fail', () => {
        expect(true).toBe(true)
    })

    describe('remove from cart', () => {
        it('should remove a product from cart', () => {
            const cart = ShoppingCart.createEmpty()
            let product = Product.withName('123')
            cart.addProducts([
                Product.withName('The best name'),
                Product.withName('abc'),
                product,
            ])

            cart.removeProduct(Product.withName('123'));

            expect(cart.products).not.toContain(product);
        })
    });
})
