import { Component, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgxDatatableModule, SortType } from '@swimlane/ngx-datatable';

import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { ProductService } from './../../product.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgxDatatableModule,    // Not strictly required for the Material table, but included if you need it
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnDestroy, AfterViewInit {
  products: Product[] = [];
  // Use a Material Table data source
  dataSource = new MatTableDataSource<Product>([]);
  // The columns we display in the table
  displayedColumns: string[] = ['position', 'title', 'price', 'actions'];
  subscription: Subscription;

  // Sort & Paginator references
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private productService: ProductService) {
    // Subscribe to products from Firebase
    this.subscription = this.productService.getAll().subscribe((items) => {
      console.log('Products from DB:', items);

      // Convert string price to number if needed
      items.forEach((p: any, index: number) => {
        if (typeof p.price === 'string') {
          p.price = parseFloat(p.price);
        }
      });

      this.products = items;
      // For the "position" column, we add an index-based property
      this.dataSource.data = items.map((product, index) => ({
        ...product,
        position: index + 1
      }));
    });
  }

  ngAfterViewInit() {
    // Initialize sort & paginator after view is ready
    if (!this.dataSource) {
      this.dataSource = new MatTableDataSource<Product>([]);
    }
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // Filter by title
  filter(query: string) {
    if (!query) {
      // If no query, revert to original array with position
      this.dataSource.data = this.products.map((product, index) => ({
        ...product,
        position: index + 1
      }));
    } else {
      const lower = query.toLowerCase();
      this.dataSource.data = this.products
        .filter((p) => p.title?.toLowerCase().includes(lower))
        .map((product, index) => ({ ...product, position: index + 1 }));
    }
    // Reset to first page
    this.dataSource.paginator?.firstPage();
  }

  // Delete product from DB + local data
  deleteProduct(productId: string) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(productId)
      .then(() => {
        console.log('Product deleted:', productId);
        // Remove from local array
        this.products = this.products.filter(p => p.$key !== productId);
        // Update dataSource
        this.dataSource.data = this.products.map((product, index) => ({
          ...product,
          position: index + 1
        }));
      })
      .catch(err => console.error('Delete failed:', err));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
