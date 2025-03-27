import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryService } from '../../category.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'product-filter',
  imports: [CommonModule, RouterLink],
  templateUrl: './product-filter.component.html',
  styleUrl: './product-filter.component.css'
})
export class ProductFilterComponent {
   categories$: Observable<{ $key: string, name?: string, title?: string }[]>;
   @Input('category') category: string | null = null;
   

   private categoryService: CategoryService;

   constructor(categoryService: CategoryService) {
     this.categoryService = categoryService;

    this.categories$ = categoryService.getCategories();

    console.log('Subscribing to categories$:', this.categories$);


}



ngOnInit(): void {
  this.categories$ = this.categoryService.getCategories();

  console.log('Subscribing to categories$:', this.categories$);
  this.categories$.subscribe(data => console.log('Categories received in component:', data));
}

}