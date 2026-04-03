import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe, DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DateRangePickerComponent, DateRange } from '../../../shared/components/date-range-picker/date-range-picker.component';
import { Order, OrderStatus } from '../../../shared/models/order.model';
import { OrderService } from '../services/order.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, TitleCasePipe, DatePipe, MatCardModule, MatTableModule, MatChipsModule, MatIconModule, MatButtonModule, MatTooltipModule, DateRangePickerComponent],
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit, OnDestroy {
  orders: Order[] = [];
  allOrders: Order[] = [];
  displayedColumns = ['orderNumber', 'customer', 'items', 'total', 'status', 'date', 'actions'];
  statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed', 'cancelled'];
  selectedStatus: OrderStatus | '' = '';
  activeDateRange: DateRange = { start: null, end: null };

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
        this.allOrders = orders;
        this.applyFilters();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onStatusFilter(status: OrderStatus | ''): void {
    this.selectedStatus = status;
    this.applyFilters();
  }

  onDateRangeChange(range: DateRange): void {
    this.activeDateRange = range;
    this.applyFilters();
  }

  private applyFilters(): void {
    let filtered = [...this.allOrders];

    if (this.selectedStatus) {
      filtered = filtered.filter(o => o.status === this.selectedStatus);
    }

    if (this.activeDateRange.start && this.activeDateRange.end) {
      const start = this.activeDateRange.start.getTime();
      const end = this.activeDateRange.end.getTime();
      filtered = filtered.filter(o => {
        const created = new Date(o.createdAt).getTime();
        return created >= start && created <= end;
      });
    }

    this.orders = filtered;
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
