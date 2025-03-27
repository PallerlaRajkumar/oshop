import { Injectable, inject } from '@angular/core';
import { Database, ref, set, get, update, remove, push, onValue } from '@angular/fire/database';
import { Product } from './models/product'; // ✅ Ensure correct path
import { Observable } from 'rxjs';
import { ShoppingCart } from './models/shopping-cart';
import { getDatabase } from '@angular/fire/database';


@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private db = inject(Database);

  constructor() {

    
  }

  private async create(): Promise<string> {
    const cartRef = ref(this.db, '/shopping-carts');
    const newCartRef = push(cartRef);
    await set(newCartRef, { dateCreated: new Date().getTime() });
    return newCartRef.key as string; // ✅ Ensure key is returned as a string
  }


  async clearCart() {
    const cartId = await this.getOrCreateCartId();
    const db = getDatabase();
    const itemRef = ref(db, `/shopping-carts/${cartId}/items`);
    await remove(itemRef);
  }

  getCart(): Observable<ShoppingCart> {
    return new Observable<ShoppingCart>(observer => {
      this.getOrCreateCartId().then(cartId => {
        const cartRef = ref(this.db, `/shopping-carts/${cartId}`);
        onValue(cartRef, snapshot => {
          const cartData = snapshot.exists() ? snapshot.val() : {};
          const itemsMap = cartData.items || {};
          observer.next(new ShoppingCart(itemsMap));
        });
      });
    });
  }
  
  private async getOrCreateCartId(): Promise<string> {
    // Check if localStorage is available (i.e., in the browser)
    if (typeof localStorage === 'undefined') {
      // In a server-side environment, you can either:
      // - Return a default/fallback cartId, or
      // - Throw an error if localStorage is required.
      return 'ssr-cart-id'; // Fallback value for server-side rendering
    }
  
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;
  
    const newCartId = await this.create();
    if (newCartId) {
      localStorage.setItem('cartId', newCartId);
      return newCartId;
    }
    
    throw new Error('❌ Failed to create cart');
  }
  

  async addToCart(product: Product): Promise<void> {
    if (!product || !product.$key) {
      console.error('❌ Invalid product: Missing key property');
      return;
    }

    const cartId = await this.getOrCreateCartId();
    const itemKey = this.sanitizeKey(product.$key);
    const itemRef = ref(this.db, `/shopping-carts/${cartId}/items/${itemKey}`);

    const itemSnap = await get(itemRef);
    if (itemSnap.exists()) {
      const quantity = itemSnap.val().quantity + 1;
      await update(itemRef, { quantity });
    } else {
      await set(itemRef, { 
        title: product.title, 
        price: product.price, 
        imageUrl: product.imageUrl, 
        quantity: 1 
      });
    }

    console.log(`✅ Item ${product.title} added to cart`);
  }

  async removeFromCart(product: Product): Promise<void> {
    if (!product || !product.$key) {
      console.error('❌ Invalid product: Missing key property');
      return;
    }

    const cartId = await this.getOrCreateCartId();
    const itemKey = this.sanitizeKey(product.$key);
    const itemRef = ref(this.db, `/shopping-carts/${cartId}/items/${itemKey}`);

    const itemSnap = await get(itemRef);
    if (itemSnap.exists()) {
      const quantity = itemSnap.val().quantity;
      if (quantity > 1) {
        await update(itemRef, { quantity: quantity - 1 });
      } else {
        await remove(itemRef);
      }
    }

    console.log(`✅ Item ${product.title} removed from cart`);
  }

  private sanitizeKey(key: string): string {
    return key.replace(/[.#$\/[\]]/g, '_'); // ✅ Ensures valid Firebase key format
  }
}
