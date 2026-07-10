import { Component, EventEmitter, Input, Output } from '@angular/core';
import {Worker} from '../../models/worker.entity';
import {StaffItemComponent} from '../staff-item/staff-item.component';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
import {MatButton} from '@angular/material/button';
@Component({
  selector: 'app-staff-list',
  imports: [CommonModule, StaffItemComponent, TranslatePipe, MatButton],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent {
  @Input() WorkerList: Worker[]= [];
  @Input() showAddButton = true;
  @Input() showHeader = true;
  @Input() selectable = false;
  @Input() selectedWorkerId: number | null = null;
  /** Cuando es true, cada trabajador muestra acciones de editar/eliminar en vez de selección. */
  @Input() manageable = false;
  @Output() addStaffRequested = new EventEmitter<void>();
  @Output() workerSelected = new EventEmitter<Worker>();
  @Output() editWorkerRequested = new EventEmitter<Worker>();
  @Output() deleteWorkerRequested = new EventEmitter<Worker>();

  selectWorker(worker: Worker): void {
    if (!this.selectable) return;
    this.workerSelected.emit(worker);
  }
}
