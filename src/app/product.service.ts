import { Injectable } from '@angular/core';
import { Database, ref, push, listVal, objectVal, update, remove } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private db: Database) {}

  /**
   * Creates a new product under /products
   * @param product The product data to store
   */
  create(product: any) {
    // Points to /products in your Realtime Database
    const productsRef = ref(this.db, 'products');
    // push(...) returns a Promise<ThenableReference>
    return push(productsRef, product);
  }

  /**
   * Retrieves all products as an Observable array
   * Each product object includes its Firebase key in '$key'
   */
  getAll(): Observable<any[]> {
    // Points to /products
    const productsRef = ref(this.db, 'products');
    // listVal(...) returns an Observable array of child data
    // { keyField: '$key' } merges each child's key into the object as '$key'
    return listVal<any>(productsRef, { keyField: '$key' });
  }

  /**
   * Retrieves a single product by its ID (Firebase key)
   * The returned object also includes '$key'
   */
  get(productId: string): Observable<any> {
    // Points to /products/<productId>
    const productRef = ref(this.db, `products/${productId}`);
    // objectVal(...) returns an Observable of a single object
    // { keyField: '$key' } merges the key into the object
    return objectVal<any>(productRef, { keyField: '$key' });
  }

  /**
   * Updates an existing product at /products/<productId>
   * @param product The updated product data
   */
  update(productId: string, product: any) {
    // Points to /products/<productId>
    const productRef = ref(this.db, `products/${productId}`);
    // update(...) returns a Promise
    return update(productRef, product);
  }

  /**
   * Deletes a product by removing /products/<productId>
   */
  delete(productId: string) {
    // Points to /products/<productId>
    const productRef = ref(this.db, `products/${productId}`);
    // remove(...) returns a Promise
    return remove(productRef);
  }
}
