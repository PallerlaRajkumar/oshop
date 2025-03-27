import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule],                // <-- important for *ngFor, date pipe, etc.
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.css']
})
export class AdminOrdersComponent {
  orders$!: Observable<any[]>;           // or the appropriate type

  constructor(private orderService: OrderService) {
    this.orders$ = this.orderService.getOrders();
  }
}
