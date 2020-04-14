import {ShoppingCartFixture} from '../domain/shoppingcarts/shoppingcart_fixture'

export interface ShoppingCartItemData {
  id: string
  name: string
  label?: string
  packagingType: string
  amount: string
  price: string
}

export class ShoppingCartsApi {
  private _fixture: ShoppingCartFixture

  public constructor(fixture: ShoppingCartFixture) {
    this._fixture = fixture
  }

  public createEmptyShoppingCart(): string {
    return this._fixture.createShoppingCart([])
  }

  public createShoppingCartWithItems(...items: ShoppingCartItemData[]): string {
    return this._fixture.createShoppingCart(items)
  }

  public addItemToShoppingCart(cartId: string, data: ShoppingCartItemData): void {
    this._fixture.addItemToShoppingCart(cartId, data)
  }

  public removeItemFromShoppingCart(cartId: string, item: ShoppingCartItemData): void {
    this._fixture.removeItemFromShoppingCart(cartId, item)
  }

  public checkOut(id: string): void {
    this._fixture.checkOut(id)
  }

  public getShoppingCartItems(id: string): ShoppingCartItemData[] {
    return this._fixture.getShoppingCartItems(id)
  }

  public getShoppingCartItemCount(id: string): number {
    return this._fixture.getShoppingCartItemCount(id)
  }

  public isShoppingCartEmpty(id: string): boolean {
    return this._fixture.isShoppingCartEmpty(id)
  }
}
