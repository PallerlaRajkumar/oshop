import { Component } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';            // <-- Added 'of' here
import { User } from 'firebase/auth';             // <-- Use the modular 'firebase/auth' type
import { AuthService } from '../auth.service';
import { OrderService } from '../order.service';

import { CommonModule } from '@angular/common';  

@Component({
  selector: 'my-orders',
  imports:[CommonModule],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent {
  orders$: Observable<any[]>;                     // Type your observable

  constructor(
    private authService: AuthService,
    private orderService: OrderService
  ) {
    this.orders$ = this.authService.user$.pipe(
      switchMap((user: User | null) => {          // Use 'User | null' from 'firebase/auth'
        if (!user) return of([]);                 // Import 'of' from 'rxjs' to return an empty array
        return this.orderService.getOrdersByUser(user.uid);
      })
    );
  }
}
