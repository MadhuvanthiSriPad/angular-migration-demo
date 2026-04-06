import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./features/products/products.routes').then(m => m.PRODUCTS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'orders',
    loadChildren: () => import('./features/orders/orders.routes').then(m => m.ORDERS_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'customers',
    loadComponent: () => import('./features/customers/customer-list/customer-list.component').then(m => m.CustomerListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  { path: '**', redirectTo: 'dashboard' }
];
