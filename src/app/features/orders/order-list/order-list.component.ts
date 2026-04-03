import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Order, OrderStatus } from '../../../shared/models/order.model';
import { OrderService } from '../services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  displayedColumns = ['orderNumber', 'customer', 'items', 'total', 'status', 'date', 'actions'];
  statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
  selectedStatus: OrderStatus | '' = '';

  private destroy$ = new Subject<void>();

  constructor(
    private orderService: OrderService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orderService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.orders = this.selectedStatus
          ? orders.filter(o => o.status === this.selectedStatus)
          : orders;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStatusFilter(status: OrderStatus | ''): void {
    this.selectedStatus = status;
    this.orderService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.orders = status ? orders.filter(o => o.status === status) : orders;
      });
  }

  onViewDetail(order: Order): void {
    this.router.navigate(['/orders', order.id]);
  }

  onAdvanceStatus(order: Order): void {
    const flow: Record<OrderStatus, OrderStatus | null> = {
      pending:    'processing',
      processing: 'shipped',
      shipped:    'completed',
      completed:  null,
      cancelled:  null
    };
    const next = flow[order.status];
    if (!next) return;
    this.orderService.updateStatus(order.id, next).subscribe(() => {
      this.notificationService.success(`Order ${order.orderNumber} moved to "${next}".`);
    });
  }

  canAdvance(order: Order): boolean {
    return !['completed', 'cancelled'].includes(order.status);
  }
}
