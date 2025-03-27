import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit , Input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../category.service';
import { ProductService } from '../../product.service';
import { Observable } from 'rxjs';
import { ProductCardComponent } from '../../product-card/product-card.component';
import { Product } from '../../models/product';
import { Category } from '../../models/Category';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @Input() showActions: boolean = true;

  categories$: Observable<Category[]> = null!;
  product: Product = {
    title: '',
    price: 0,
    category: '',
    imageUrl: ''
  };
  id: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.productService.get(this.id).subscribe(p => {
        if (p) {
          this.product = p;
          console.log('Product loaded for edit:', this.product);
        } else {
          console.error('No product found with id:', this.id);
        }
      });
    } else {
      console.log('No product id provided; operating in create mode.');
    }

    this.categories$ = this.categoryService.getCategories();
    this.categories$.subscribe(data => {
      console.log('Categories from DB:', data);
    });
  }

  onDelete(): void {
    if (!this.id) {
      console.warn('No product id found. Delete cannot proceed.');
      return;
    }
    if (!confirm('Are you sure you want to delete this product?')) return;

    this.productService.delete(this.id)
      .then(() => {
        console.log('Product deleted successfully');
        this.router.navigate(['/admin/products']);
      })
      .catch(err => {
        console.error('Delete failed:', err);
      });
  }

  save(product: Product): void {
    console.log('save() called with product:', product);
    if (this.id) {
      // Update existing product
      this.productService.update(this.id, product)
        .then(() => {
          console.log('Product updated successfully');
          this.router.navigate(['/admin/products']);
        })
        .catch(err => console.error('Update error:', err));
    } else {
      // Create new product
      this.productService.create(product)
        .then((ref) => {
          console.log('New product created, key:', ref.key);
          this.router.navigate(['/admin/products']);
        })
        .catch(err => console.error('Create error:', err));
    }
  }
}
