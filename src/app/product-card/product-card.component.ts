import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductQuantityComponent } from '../product-quantity/product-quantity.component'; 
import { Product } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';
import { ShoppingCartService } from '../shopping-cart.service';

@Component({
  selector: 'product-card',
  standalone: true,
  imports: [
    CommonModule,
    ProductQuantityComponent // <-- Important
  ],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
  @Input() product!: Product;
  @Input('shopping-cart') shoppingCart!: ShoppingCart;
  @Input() showActions: boolean = true;



  shoppingCart$!: Observable<ShoppingCart>;

  constructor(private cartService: ShoppingCartService) {}

  ngOnInit() {
    this.shoppingCart$ = this.cartService.getCart();
  }

  addToCart() {
    this.cartService.addToCart(this.product);
  }

  removeFromCart(product: Product) {
    this.cartService.removeFromCart(product);
  }

  getQuantity(cart: ShoppingCart | null): number {
    if (!cart) return 0;
    return cart.getQuantity(this.product);
  }
}
