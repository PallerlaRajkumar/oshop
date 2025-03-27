import { CategoryService } from './../category.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { ProductService } from '../product.service';
import { Product } from '../models/product';


@Component({
  standalone: true,
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  subscription!: Subscription;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    // Subscribe to product list from Firebase
    this.subscription = this.productService.getAll().subscribe((items) => {
      console.log('Fetched products for home page:', items);
      // Convert price to number if it's stored as a string
      items.forEach((p: any) => {
        if (typeof p.price === 'string') {
          p.price = parseFloat(p.price);
        }
      });
      this.products = items;
    });
  }

  addToCart(product: Product) {
    // Logic to add this product to the user's cart
    console.log('Add to cart:', product);
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
