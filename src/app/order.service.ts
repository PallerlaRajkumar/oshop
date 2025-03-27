import { ShoppingCartService } from './shopping-cart.service';
import { Injectable } from '@angular/core';
import { Database, ref, push } from '@angular/fire/database';
import { listVal } from 'rxfire/database';  // rxfire utilities
import { Observable } from 'rxjs';
import {  query, orderByChild, equalTo } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private db: Database, private shoppingCartService: ShoppingCartService) {}

 async  placeOrder(order: any) {
    const ordersRef = ref(this.db, '/orders');
    this.shoppingCartService.clearCart();
    return await push(ordersRef, order);
  }


  getOrders(){

    const ordersRef = ref(this.db, 'orders');
    // Convert that reference into an RxJS Observable array
    return listVal<any>(ordersRef);
  }

  getOrdersByUser(userId: string): Observable<any[]> {
    // Create a query to "/orders" ordered by "userId" equal to the provided userId
    const ordersQuery = query(
      ref(this.db, 'orders'),
      orderByChild('userId'),
      equalTo(userId)
    );
  
    // <-- Make sure to return your Observable here
    return listVal<any>(ordersQuery);
  }
  
}
