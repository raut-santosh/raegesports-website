import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environments';
import { AuthService } from '../auth/auth.service';
@Injectable({
  providedIn: 'root'
})
export class HelperService {

  currentUserData: any = {};

  constructor(private apiService: ApiService, private authService: AuthService) {
    // this.setCurrentUser();
   }

  // setCurrentUser() {
  //   this.apiService.callApi('users/me', 'get').subscribe(
  //     (res) => {
  //       console.log('setting user', res);
  //       this.currentUserData = res.data;
  //       localStorage.setItem('currentUserData', JSON.stringify(this.currentUserData));
  //     },
  //     (err) => {
  //       console.log('error ', err);
  //     }
  //   );
  // }
  
  // getCurrentUser() {
  //   let ls: string | null = localStorage.getItem('currentUserData');
  //   let user;
  //   if (ls !== null) {
  //     user = JSON.parse(ls);
  //     console.log(user);
  //   } else {
  //     // Handle the case where 'currentUserData' is not found in localStorage
  //     this.setCurrentUser();
  //     user = this.currentUserData;
  //     // console.error('currentUserData not found in localStorage');
  //   }
  //   return user;
  // }
  
  getAvatarUrl(){
    // return `${environment.apiUrl}/assets/${this.currentUserData.avatar}?access_token=${this.authService.localUser.access_token}`
  }
}
