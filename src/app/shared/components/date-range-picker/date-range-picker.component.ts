import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

@Component({
  selector: 'app-date-range-picker',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule],
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss']
})
export class DateRangePickerComponent implements OnInit {
  @Input() label = 'Date range';
  @Output() rangeChange = new EventEmitter<DateRange>();

  form!: FormGroup;
  maxDate = new Date();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      start: [null],
      end:   [null]
    });

    this.form.valueChanges.subscribe((value: DateRange) => {
      if (value.start && value.end) {
        this.rangeChange.emit(value);
      }
    });
  }

  clear(): void {
    this.form.reset();
    this.rangeChange.emit({ start: null, end: null });
  }
}
