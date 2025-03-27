import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../auth.service';
import { ShoppingCartService } from '../shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';

@Component({
  selector: 'bs-navbar',
  standalone: true,
  // Remove providers so that the shared instance is used:
  // providers: [ShoppingCartService],
  imports: [CommonModule, RouterModule, NgbDropdownModule],
  templateUrl: './bs-navbar.component.html'
})
export class BsNavbarComponent implements OnInit {
  cart$!: Observable<ShoppingCart>;
  cartItemCount = 0;

  constructor(public auth: AuthService, private cartService: ShoppingCartService) {}

  ngOnInit(): void {
    // Get the cart observable without using async/await
    this.cart$ = this.cartService.getCart();

    // Subscribe to update the cartItemCount when cart changes
    this.cart$.subscribe(cart => {
      // If your ShoppingCart model has a built-in totalItemsCount, use it:
      // this.cartItemCount = cart.totalItemsCount;
      // Otherwise, calculate it manually:
      let count = 0;
      for (let productId in cart.itemsMap) {
        if (cart.itemsMap.hasOwnProperty(productId)) {
          count += cart.itemsMap[productId].quantity;
        }
      }
      this.cartItemCount = count;
    });
  }

  logout() {
    this.auth.logout();
  }
}
