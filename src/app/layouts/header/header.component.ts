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
  currentUserName: any;
  constructor(private apiService:ApiService, public helperService: HelperService,public authService: AuthService){}
  ngOnInit(){
    this.model = this.helperService.getCurrentUser();
    this.currentUserName = this.model.first_name + ' ' + this.model.last_name;
  }
 
}
