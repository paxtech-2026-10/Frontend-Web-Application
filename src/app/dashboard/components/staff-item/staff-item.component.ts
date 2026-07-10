import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Worker} from '../../models/worker.entity';
import {MatCard} from '@angular/material/card';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-staff-item',
  imports: [
    MatCard,
    MatButton,
    MatIconButton,
    MatIcon,
    TranslatePipe
  ],
  templateUrl: './staff-item.component.html',
  styleUrl: './staff-item.component.css'
})
export class StaffItemComponent {
  @Input() worker!: Worker;
  @Input() selected = false;
  @Input() actionLabel: string | null = null;
  /** Cuando es true, muestra acciones de editar/eliminar en vez del botón de selección. */
  @Input() manageable = false;
  @Output() editRequested = new EventEmitter<Worker>();
  @Output() deleteRequested = new EventEmitter<Worker>();

  constructor() {}
}
