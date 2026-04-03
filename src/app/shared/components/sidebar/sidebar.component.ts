import { Component } from '@angular/core';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
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
