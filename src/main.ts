import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes, withComponentInputBinding, withHashLocation } from '@angular/router';
import { AppComponent } from './app/app.component';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from './environments/environment';
import { HomeComponent } from './app/home/home.component';
import { ProductsComponent } from './app/products/products.component';
import { ShoppingCartComponent } from './app/shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './app/check-out/check-out.component';
import { OrderSuccessComponent } from './app/order-success/order-success.component';
import { LoginComponent } from './app/login/login.component';
import { AdminProductsComponent } from './app/admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './app/admin/admin-orders/admin-orders.component';
import { MyOrdersComponent } from './app/my-orders/my-orders.component';
import { AuthGuardService } from './app/auth-guard.service';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { adminAuthGuard } from './app/admin-auth-guard.service';
import { ProductFormComponent } from './app/admin/product-form/product-form.component';
import { FormsModule } from '@angular/forms';
import {CustomFormsModule} from 'ng2-validation';
import { DataTablesModule } from 'angular-datatables';
import { MatTableModule } from '@angular/material/table';


const routes: Routes = [
  { path: '', component: ProductsComponent, pathMatch: 'full' },
 
  { path: 'login', component: LoginComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'shopping-cart', component: ShoppingCartComponent },

  { path: 'check-out', component: CheckOutComponent, canActivate: [AuthGuardService] },
  { path: 'order-success/:id', component: OrderSuccessComponent, canActivate: [AuthGuardService] },
  { path: 'my/orders', component: MyOrdersComponent, canActivate: [AuthGuardService] },
 

  { path: 'admin/products/new', component: ProductFormComponent, canActivate: [AuthGuardService, adminAuthGuard] },
  { path: 'admin/products/:id', component: ProductFormComponent, canActivate: [AuthGuardService, adminAuthGuard] },
  { path: 'admin/products', component: AdminProductsComponent, canActivate: [AuthGuardService, adminAuthGuard] },
  
  { path: 'admin/orders', component: AdminOrdersComponent, canActivate: [AuthGuardService, adminAuthGuard] },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withHashLocation()), // Add withHashLocation
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => {
      if (typeof window === 'undefined') {
        return {} as any; // Mock for server-side
      }
      return getDatabase();
    }),
  ],
}).catch((err) => console.error(err));