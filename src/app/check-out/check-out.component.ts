// check-out.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../auth.service';
import { OrderService } from '../order.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartItem } from '../models/shopping-cart-item';
import { ShoppingCartSummaryComponent } from '../shopping-cart-summary/shopping-cart-summary.component';

@Component({
  selector: 'check-out',
  standalone: true,
  imports: [CommonModule, FormsModule, ShoppingCartSummaryComponent],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {
  shipping: any = {};
  cart!: ShoppingCart;

  cartSubscription!: Subscription;
  userSubscription!: Subscription;
  userId!: string;

  constructor(
    private authService: AuthService,
    private orderService: OrderService,
    private shoppingCartService: ShoppingCartService,
    private router: Router
  ) {}

  async ngOnInit() {
    // 1) Load cart
    const cart$ = await this.shoppingCartService.getCart();
    this.cartSubscription = cart$.subscribe(cart => {
      // 'cart' is presumably a 'ShoppingCart'
      this.cart = cart;
    });

    // 2) Load user
    this.userSubscription = this.authService.user$.subscribe(user => {
      if (user) this.userId = user.uid;
    });
  }

  ngOnDestroy() {
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
    if (this.userSubscription) this.userSubscription.unsubscribe();
  }

  placeOrder() {
    // Convert cart's itemsMap to an array, 
    // then build the final order object
    const items = Object.values(this.cart.itemsMap);

    const order = {
      userId: this.userId,
      datePlaced: new Date().getTime(),
      shipping: this.shipping,
      items: items.map((i: ShoppingCartItem) => ({
        product: {
          title: i.title,
          imageUrl: i.imageUrl,
          price: i.price
        },
        quantity: i.quantity,
        totalPrice: i.price * i.quantity
      }))
    };

    console.log('[DEBUG] Submitting Order:', order);

    this.orderService.placeOrder(order)
      .then(result => {
        console.log('[SUCCESS] Order submitted!', result);
        // If your result has a .key, you can navigate with it
        this.router.navigate(['/order-success', result.key]);
      })
      .catch(error => {
        console.error('[ERROR] Order failed:', error);
      });
  }
}
