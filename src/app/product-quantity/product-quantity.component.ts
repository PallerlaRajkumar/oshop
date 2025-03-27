// src/app/product-quantity/product-quantity.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'product-quantity',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-quantity.component.html'
})
export class ProductQuantityComponent {
  @Input() quantity = 0;
  @Output() add = new EventEmitter<void>();
  @Output() remove = new EventEmitter<void>();

  onAdd() {
    this.add.emit();
  }

  onRemove() {
    this.remove.emit();
  }
}
