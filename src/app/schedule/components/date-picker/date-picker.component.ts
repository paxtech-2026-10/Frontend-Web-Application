import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DatePipe, JsonPipe, NgForOf, NgIf} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.css',
  providers: [provideNativeDateAdapter()],
  imports: [MatCardModule, MatDatepickerModule, DatePipe, MatButton, NgForOf, NgIf],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent {
  selected: Date | null = null;

  timeSlots = [
    { id: '1', start: new Date(0,0,0,9,0), end: new Date(0,0,0,10,0), tipo: 'Standard' },
    { id: '2', start: new Date(0,0,0,10,0), end: new Date(0,0,0,11,0), tipo: 'Standard' },
    { id: '3', start: new Date(0,0,0,11,0), end: new Date(0,0,0,12,0), tipo: 'Standard' },
    { id: '4', start: new Date(0,0,0,12,0), end: new Date(0,0,0,13,0), tipo: 'Standard' },
    { id: '5', start: new Date(0,0,0,13,0), end: new Date(0,0,0,14,0), tipo: 'Standard' },
    { id: '6', start: new Date(0,0,0,14,0), end: new Date(0,0,0,15,0), tipo: 'Standard' },
    { id: '7', start: new Date(0,0,0,15,0), end: new Date(0,0,0,16,0), tipo: 'Standard' },
    { id: '8', start: new Date(0,0,0,16,0), end: new Date(0,0,0,17,0), tipo: 'Standard' },
    { id: '9', start: new Date(0,0,0,17,0), end: new Date(0,0,0,18,0), tipo: 'Standard' },

    // Agrega más rangos horarios aquí
  ];

  selectedTimeSlot: any = null;

  @Output() reservationConfirmed = new EventEmitter<{date: Date, timeSlot: any}>();

  selectTimeSlot(slot: any) {
    this.selectedTimeSlot = slot;
    console.log(this.selectedTimeSlot);

    if (this.selected && this.selectedTimeSlot) {
      // Emitir la fecha y rango horario seleccionados
      this.reservationConfirmed.emit({date: this.selected, timeSlot: this.selectedTimeSlot});
    }
  }
}
