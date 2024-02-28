import { Component } from '@angular/core';
import { ApiService,  HelperService } from 'src/app/services';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  model: any = {};
  apiUrl = environment.apiUrl;

  constructor(public apiService:ApiService){}
  ngOnInit(){
    
  }

 
}
