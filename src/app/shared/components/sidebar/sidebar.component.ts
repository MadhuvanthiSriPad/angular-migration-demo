import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard',  icon: 'dashboard',      route: '/dashboard' },
    { label: 'Products',   icon: 'inventory_2',    route: '/products' },
    { label: 'Orders',     icon: 'shopping_cart',  route: '/orders' },
    { label: 'Customers',  icon: 'people',         route: '/customers' }
  ];
}
