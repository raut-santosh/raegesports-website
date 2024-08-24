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
    setInterval(() => {
      this.getNotifications();
    }, 20000);
  }

  getNotifications(){
    this.apiService.get('notifications', {fields:"*.*"}).subscribe(
      res => {
        console.log('sam here',res.data);
        this.notifications = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }
}
