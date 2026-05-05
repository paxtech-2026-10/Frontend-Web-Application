import { Component } from '@angular/core';
import {AppointmentsListComponent} from "../../components/appointments-list/appointments-list.component";
import {SidebarClientComponent} from "../../../public/components/sidebar-client/sidebar-client.component";
import {UpcomingAppointmentsComponent} from '../../../dashboard/components/upcoming-appointments/upcoming-appointments.component';

@Component({
  selector: 'app-client-appointment-pages',
  imports: [
    AppointmentsListComponent,
    SidebarClientComponent,
    UpcomingAppointmentsComponent,
  ],
  templateUrl: './client-appointment-pages.component.html',
  styleUrl: './client-appointment-pages.component.css'
})
export class ClientAppointmentPagesComponent {

}
