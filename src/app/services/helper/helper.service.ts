import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  currentUserData: any = {};

  constructor(private apiService: ApiService) { }

  getUserData(){
    this.apiService.callApi('users/me','get').subscribe(
      (res) => {
        console.log('setting user', res)
        this.currentUserData = res.data;
      },
      (err) => {
        console.log('error ', err);
      }
    )
  }

}
