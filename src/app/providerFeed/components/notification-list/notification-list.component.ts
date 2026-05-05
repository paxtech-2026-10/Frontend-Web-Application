import { Component, OnInit, inject } from '@angular/core';
import {Notifications} from '../../model/notifications.entity';
import { NotificationApiService } from '../../services/notification-api.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [
    MatIcon,
    NgIf,
    NgForOf
  ],
  providers: [DatePipe],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.css'
})
export class NotificationListComponent implements OnInit {
  notifications: Notifications[] = [];
  private notificationService = inject(NotificationApiService);
  private datePipe = inject(DatePipe);

  ngOnInit(): void {
    this.notificationService.getAll().subscribe(data => {
      this.notifications = data.sort((a, b) =>
        new Date(b.notificationDate).getTime() - new Date(a.notificationDate).getTime()
      );
    });
  }

  getRelativeTime(date: Date): string {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'Now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffHours < 48) return 'Yesterday';
    return this.datePipe.transform(notificationDate, 'dd/MM') || '';
  }

}
