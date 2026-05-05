import { Component, Input } from '@angular/core';
import {Worker} from '../../models/worker.entity';
import {StaffItemComponent} from '../staff-item/staff-item.component';
import {CommonModule} from '@angular/common';
import {TranslatePipe} from '@ngx-translate/core';
@Component({
  selector: 'app-staff-list',
  imports: [CommonModule, StaffItemComponent, TranslatePipe],
  templateUrl: './staff-list.component.html',
  styleUrl: './staff-list.component.css'
})
export class StaffListComponent {
  @Input() WorkerList: Worker[]= [];
}
