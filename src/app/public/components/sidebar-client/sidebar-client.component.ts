import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {
  UpcomingAppointmentsComponent
} from '../../../appointments/components/upcoming-appointments/upcoming-appointments.component';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar-client',
  imports: [
    RouterLink,
    RouterModule,
    RouterLinkActive,
    RouterOutlet,
    UpcomingAppointmentsComponent,
    TranslatePipe
  ],
  templateUrl: './sidebar-client.component.html',
  styleUrl: './sidebar-client.component.css'
})
export class SidebarClientComponent {

}
