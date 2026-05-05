import { Component } from '@angular/core';
import {SidebarClientComponent} from '../../../public/components/sidebar-client/sidebar-client.component';
import {SalonGridComponent} from '../../../dashboard/components/salon-grid/salon-grid.component';
import {
  UpcomingAppointmentsComponent
} from '../../../dashboard/components/upcoming-appointments/upcoming-appointments.component';

@Component({
  selector: 'app-client-favorite',
  imports: [
    SidebarClientComponent,
    SalonGridComponent,
    UpcomingAppointmentsComponent,
  ],
  templateUrl: './client-favorite.component.html',
  styleUrl: './client-favorite.component.css'
})
export class ClientFavoriteComponent {

}
