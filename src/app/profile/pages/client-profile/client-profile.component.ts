import { Component } from '@angular/core';
import {ProfileClientComponent} from '../../components/profile/profile-client.component';
import {SidebarClientComponent} from '../../../public/components/sidebar-client/sidebar-client.component';

@Component({
  selector: 'app-client-profile',
  imports: [
    ProfileClientComponent,
    SidebarClientComponent,
  ],
  templateUrl: './client-profile.component.html',
  styleUrl: './client-profile.component.css'
})
export class ClientProfileComponent {

}
