import { Component } from '@angular/core';
import { ApiService, AuthService, HelperService } from 'src/app/services';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  model: any = {};
  apiUrl = environment.apiUrl;
  constructor(private apiService:ApiService, private helperService: HelperService,public authService: AuthService){}
  ngOnInit(){
    this.getAvatar();
  }
  getAvatar(){
    this.helperService.getUserData()
    console.log(this.authService.currentUser)
    this.model = this.helperService.currentUserData;
  }
}
