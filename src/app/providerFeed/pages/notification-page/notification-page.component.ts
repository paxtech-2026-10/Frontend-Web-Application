import { Component } from '@angular/core';
import {NotificationListComponent} from '../../components/notification-list/notification-list.component';

@Component({
  selector: 'app-notification-page',
  imports: [
    NotificationListComponent
  ],
  templateUrl: './notification-page.component.html',
  styleUrl: './notification-page.component.css'
})
export class NotificationPageComponent {

}
