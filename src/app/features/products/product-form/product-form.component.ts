import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProductService } from '../services/product.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Product, ProductCategory } from '../../../shared/models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent implements OnInit {
  form!: FormGroup;
  isEditMode = false;
  productId: string | null = null;
  isSaving = false;

  categories: ProductCategory[] = ['electronics', 'grocery', 'apparel', 'home-goods', 'toys', 'sports'];
  statuses: Product['status'][] = ['active', 'inactive', 'discontinued'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId && this.productId !== 'new';

    this.form = this.fb.group({
      sku:           ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]+$/)]],
      name:          ['', [Validators.required, Validators.minLength(3)]],
      description:   ['', Validators.required],
      category:      ['', Validators.required],
      price:         [null, [Validators.required, Validators.min(0.01)]],
      stockQuantity: [null, [Validators.required, Validators.min(0)]],
      reorderPoint:  [null, [Validators.required, Validators.min(0)]],
      supplierId:    ['', Validators.required],
      status:        ['active', Validators.required]
    });

    if (this.isEditMode) {
      this.productService.getById(this.productId!).subscribe(product => {
        if (product) {
          this.form.patchValue(product);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    const payload = this.form.value;

    const request$ = this.isEditMode
      ? this.productService.update(this.productId!, payload)
      : this.productService.create(payload);

    request$.subscribe({
      next: () => {
        const msg = this.isEditMode ? 'Product updated.' : 'Product created.';
        this.notificationService.success(msg);
        this.router.navigate(['/products']);
      },
      error: () => {
        this.notificationService.error('Failed to save product. Please try again.');
        this.isSaving = false;
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/products']);
  }

  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';
    if (control.errors['required']) return `${field} is required`;
    if (control.errors['minlength']) return `Too short`;
    if (control.errors['min']) return `Must be greater than 0`;
    if (control.errors['pattern']) return `Invalid format (uppercase letters, numbers, hyphens only)`;
    return 'Invalid value';
  }
}
