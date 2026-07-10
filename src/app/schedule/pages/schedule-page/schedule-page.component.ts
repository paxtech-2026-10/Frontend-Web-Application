import { Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { CalendarComponent} from '../../components/calendar/calendar.component';

@Component({
  selector: 'app-schedule-page',
  imports: [
    CalendarComponent,
    TranslatePipe
  ],
  templateUrl: './schedule-page.component.html',
  styleUrl: './schedule-page.component.css'
})
export class SchedulePageComponent {

}
