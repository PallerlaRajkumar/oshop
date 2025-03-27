import { ShoppingCartService } from './../shopping-cart.service';
import { switchMap } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import { ProductFilterComponent } from "./product-filter/product-filter.component";
import { ProductCardComponent } from "../product-card/product-card.component";

@Component({
  selector: 'products',
  standalone: true,
  imports: [CommonModule, ProductFilterComponent, ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {
 
  products$!: Observable<any[]>;
  //categories$!: Observable<any[]>;
  products: any[] = [];
  category: string | null = null;
  filteredProducts: any[] = [];
  cart: any;
  subscription!: Subscription;

  constructor(
    route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService
  ) {

   

    this.products$ = this.productService.getAll();
    
    productService.getAll().pipe(
      switchMap(products => {
        this.products = products;
        return route.queryParamMap;
      })
    ).subscribe(params => {
      this.category = params.get('category');
      this.filteredProducts = (this.category) ?
        this.products.filter(p => p.category === this.category) :
        this.products;
    });
    
      
  }

  async ngOnInit(): Promise<void> {

  const cartObservable = await this.shoppingCartService.getCart();
  this.subscription = cartObservable.subscribe((cart: any) => this.cart = cart);


    this.products$ = this.productService.getAll();
    this.products$.subscribe(data => console.log('Products received in component:', data));
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    
  }

  addToCart(productKey: string) {
    console.log('Adding to cart:', productKey);
    // Implement your add-to-cart logic here
  }
}

