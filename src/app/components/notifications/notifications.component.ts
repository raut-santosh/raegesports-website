import { Component } from '@angular/core';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {
  notifications: any[] = [];

  constructor(public apiService:ApiService){}

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications(){
    this.apiService.get('notifications').subscribe(
      res => {
        console.log(res);
        this.notifications = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }
}
