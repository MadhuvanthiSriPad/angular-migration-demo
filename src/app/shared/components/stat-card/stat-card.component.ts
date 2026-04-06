import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-stat-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './stat-card.component.html',
  styleUrls: ['./stat-card.component.scss']
})
export class StatCardComponent {
  @Input() label!: string;
  @Input() value!: string | number;
  @Input() icon!: string;
  @Input() trend?: number;
  @Input() color: 'primary' | 'accent' | 'warn' | 'success' = 'primary';
}
