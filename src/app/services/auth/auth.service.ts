import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environments';

import { Router } from '@angular/router';
import { ApiService } from '../api/api.service';
@Injectable()
export class AuthService {
 

  apiUrl: string = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<any> | any;
  public currentUser: any;

  constructor(private http: HttpClient, public apiService: ApiService, public router: Router) {
  let ls = localStorage.getItem('currentUser');
  if (ls) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(ls));
    this.currentUser = this.currentUserSubject.asObservable();
  } else {
    this.currentUserSubject = new BehaviorSubject<any>(null);
    this.currentUser = this.currentUserSubject.asObservable();
  }
}


  public get currentUserValue(): any {
    return this.currentUserSubject?.value; 
  }


  // login(params: any) {
  //   return this.http
  //     .post<any>(
  //       this.apiUrl + '/' + this.apiService.APILIST.AUTH_LOGIN.endpoint,
  //       params
  //     )
  //     .pipe(
  //       map((data) => {
  //         if (data && data.token) {
  //           this._syncUser({token: data.token});
  //         }
  //         return data;
  //       })
  //     );
  // }

  // verifyOtp(params: any) {
  //   return this.http
  //     .post<any>(
  //       this.apiUrl + '/' + this.apiService.APILIST.VERIFY_OTP.endpoint,
  //       params
  //     )
  //     .pipe(
  //       map((data) => {
  //         if (data && data.token) {
  //           this._syncUser({token: data.token});
  //         }
  //         return data;
  //       })
  //     );
  // }
  // resendOtp(params: any) {
  //   return this.http
  //     .post<any>(
  //       this.apiUrl + '/' + this.apiService.APILIST.RESEND_OTP.endpoint,
  //       params
  //     )
  //     .pipe(
  //       map((data) => {
  //         if (data && data.token) {
  //           this._syncUser({token: data.token});
  //         }
  //         return data;
  //       })
  //     );
  // }
  // register(params: any) {
  //   return this.http
  //     .post<any>(
  //       this.apiUrl + '/' + this.apiService.APILIST.AUTH_REGISTER.endpoint,
  //       params
  //     )
  //     .pipe(
  //       map((data) => {
  //         if (data && data.token) {
  //           this._syncUser({token: data.token});
  //           console.log(data);
  //         }
  //         return data;
  //       })
  //     );
  // }

  // refreshtoken(params = null) {
    // return this.http
    //   .post<any>(
    //     this.apiUrl + '/' + this.apiService.APIS.AUTH_REFRESHTOKEN.endpoint,
    //     params
    //   )
    //   .pipe(
    //     map((data) => {
    //       this._syncUser(data);
    //       return data;
    //     })
    //   );
  // }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    if(this.currentUserSubject){
      this.currentUserSubject.next(null);
    }
    this.router.navigate(['/auth/login']);
  }

  _syncUser(data: any) {
    localStorage.setItem('currentUser', JSON.stringify(data));
    if(this.currentUserSubject) {
      this.currentUserSubject.next(data);
    }
    return true;
  }
}