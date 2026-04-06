import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { Order } from '../../../shared/models/order.model';
import { OrderService } from '../services/order.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, MatCardModule, MatTableModule, MatButtonModule, MatIconModule, MatDividerModule],
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: Order | undefined;
  itemColumns = ['sku', 'productName', 'quantity', 'unitPrice', 'lineTotal'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getById(id).subscribe(order => {
      this.order = order;
    });
  }

  onCancel(): void {
    if (!this.order || !confirm('Cancel this order?')) return;
    this.orderService.updateStatus(this.order.id, 'cancelled').subscribe(() => {
      this.notificationService.success(`Order ${this.order!.orderNumber} cancelled.`);
      this.router.navigate(['/orders']);
    });
  }

  onBack(): void {
    this.router.navigate(['/orders']);
  }
}
