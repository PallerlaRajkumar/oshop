// models/shopping-cart.ts
import { ShoppingCartItem } from './shopping-cart-item';
import { Product } from './product';

export class ShoppingCart { 
  itemsMap: { [productId: string]: ShoppingCartItem };

  constructor(itemsMap: { [productId: string]: ShoppingCartItem } = {}) {
    this.itemsMap = itemsMap || {};
  }

  // Convert itemsMap (object) to array for iteration in templates
  get items(): ShoppingCartItem[] {
    return Object.values(this.itemsMap);
  }

  get productIds() {
    return Object.keys(this.itemsMap);
  }

  getQuantity(product: Product): number {
    const key = product.$key;
    if (!key) return 0;
    const item = this.itemsMap[key];
    return item ? item.quantity : 0;
  }

  // Sum of all cart item prices (price * quantity)
  get totalPrice(): number {
    let sum = 0;
    for (let productId in this.itemsMap) {
      const item = this.itemsMap[productId];
      sum += (item.price || 0) * (item.quantity || 0);
    }
    return sum;
  }

  // Total number of items
  get totalItemsCount(): number {
    let count = 0;
    for (let productId in this.itemsMap) {
      count += this.itemsMap[productId]?.quantity || 0;
    }
    return count;
  }
}
