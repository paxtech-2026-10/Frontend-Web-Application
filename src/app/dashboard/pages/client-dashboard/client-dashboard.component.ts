import { Component } from '@angular/core';
import {UpcomingAppointmentsComponent} from "../../components/upcoming-appointments/upcoming-appointments.component";
import {SidebarClientComponent} from "../../../public/components/sidebar-client/sidebar-client.component";
import {SalonListComponent} from '../../components/salon-list/salon-list.component';

@Component({
  selector: 'app-client-dashboard',
  imports: [
    UpcomingAppointmentsComponent,
    SidebarClientComponent,
    SalonListComponent
  ],
  templateUrl: './client-dashboard.component.html',
  styleUrl: './client-dashboard.component.css'
})
export class ClientDashboardComponent {

}
