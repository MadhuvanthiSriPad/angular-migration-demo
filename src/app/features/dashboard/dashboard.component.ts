import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ProductService } from '../products/services/product.service';
import { OrderService } from '../orders/services/order.service';
import { CustomerService } from '../customers/services/customer.service';
import { Order } from '../../shared/models/order.model';
import { Product } from '../../shared/models/product.model';

interface DashboardStats {
  totalRevenue: number;
  activeCustomers: number;
  pendingOrders: number;
  lowStockCount: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats = {
    totalRevenue: 0,
    activeCustomers: 0,
    pendingOrders: 0,
    lowStockCount: 0
  };

  recentOrders: Order[] = [];
  lowStockProducts: Product[] = [];
  isLoading = true;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.orderService.getTotalRevenue(),
      this.customerService.getActiveCount(),
      this.orderService.getByStatus('pending'),
      this.productService.getLowStockProducts()
    ]).pipe(
      map(([revenue, customers, pending, lowStock]) => ({
        totalRevenue: revenue,
        activeCustomers: customers,
        pendingOrders: pending.length,
        lowStockCount: lowStock.length
      })),
      takeUntil(this.destroy$)
    ).subscribe(stats => {
      this.stats = stats;
      this.isLoading = false;
    });

    this.orderService.getRecentOrders(5)
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => this.recentOrders = orders);

    this.productService.getLowStockProducts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => this.lowStockProducts = products);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
