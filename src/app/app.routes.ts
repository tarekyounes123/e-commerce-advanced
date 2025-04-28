import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) },
  { path: 'product_list', loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent), canActivate: [AuthGuard] },
  { path: 'cart', loadComponent: () => import('./cart/cart.component').then(m => m.CartComponent), canActivate: [AuthGuard] },
  { path: 'checkout', loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent), canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];
