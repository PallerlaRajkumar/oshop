// src/app/shopping-cart/shopping-cart.component.ts
import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductQuantityComponent } from '../product-quantity/product-quantity.component';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {
  @Input('shopping-cart') shoppingCart!: ShoppingCart; // (only needed if parent passes a cart)
  cart$!: Observable<ShoppingCart>;
  cartItemCount = 0;
  totalPriceValue = 0;

  constructor(private cartService: ShoppingCartService) {}

  ngOnInit(): void {
    // Subscribe to the cart
    this.cart$ = this.cartService.getCart();
    this.cart$.subscribe(cart => {
      this.cartItemCount = cart.totalItemsCount;
      this.totalPriceValue = cart.totalPrice;
    });
  }

  get totalPrice() {
    return this.totalPriceValue;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product);
    this.refreshCart();
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
    this.refreshCart();
  }

  private refreshCart() {
    this.cart$ = this.cartService.getCart();
  }

  // Helper method to merge the key from item.key into item.value
  mergeKey(itemValue: Product, itemKey: string): Product {
    return { ...itemValue, $key: itemKey };
  }


  clearCart(){
    this.cartService.clearCart();
  }
}
