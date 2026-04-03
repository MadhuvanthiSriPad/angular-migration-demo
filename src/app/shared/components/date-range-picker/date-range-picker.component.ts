import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

/**
 * Custom branded date range picker used on the Orders list.
 *
 * MIGRATION NOTE — Angular Material 15 (MDC):
 *   The template references mat-date-range-input and mat-date-range-picker,
 *   which changed internal DOM structure in v15. The custom calendar styles
 *   in _material-overrides.scss (.mat-calendar-body-selected,
 *   .mat-datepicker-content, etc.) must be rewritten using the v15
 *   mat.datepicker-overrides() token API after migration.
 */
@Component({
  selector: 'app-date-range-picker',
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
