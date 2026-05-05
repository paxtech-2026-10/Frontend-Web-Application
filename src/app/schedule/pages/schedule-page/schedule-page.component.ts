import { Component } from '@angular/core';
import { CalendarComponent} from '../../components/calendar/calendar.component';

@Component({
  selector: 'app-schedule-page',
  imports: [
    CalendarComponent
  ],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.css'
})
export class SchedulePageComponent {

}
