export class ShoppingCartItem {
  $key: string = '';
  title: string = '';
  imageUrl: string = '';
  price: number = 0; 
  quantity: number = 0; 

  constructor(init?: Partial<ShoppingCartItem>) {
    Object.assign(this, init);
  }

  get totalPrice() :number  { return this.price * this.quantity; }
}