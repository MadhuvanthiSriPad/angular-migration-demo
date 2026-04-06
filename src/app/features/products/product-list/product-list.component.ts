import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Product, ProductCategory } from '../../../shared/models/product.model';
import { ProductService } from '../services/product.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  displayedColumns = ['sku', 'name', 'category', 'price', 'stockQuantity', 'status', 'actions'];
  dataSource = new MatTableDataSource<Product>();

  searchControl = new FormControl('');
  categoryControl = new FormControl<ProductCategory | ''>('');

  categories: ProductCategory[] = ['electronics', 'grocery', 'apparel', 'home-goods', 'toys', 'sports'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private destroy$ = new Subject<void>();

  constructor(
    private productService: ProductService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.productService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(products => {
        this.dataSource.data = products;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(value => {
      this.dataSource.filter = (value ?? '').trim().toLowerCase();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onEdit(product: Product): void {
    this.router.navigate(['/products', product.id, 'edit']);
  }

  onDelete(product: Product): void {
    if (!confirm(`Delete "${product.name}"?`)) return;
    this.productService.delete(product.id).subscribe(() => {
      this.notificationService.success(`"${product.name}" deleted.`);
    });
  }

  isLowStock(product: Product): boolean {
    return product.stockQuantity <= product.reorderPoint;
  }
}
