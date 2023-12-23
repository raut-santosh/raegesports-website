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

  login(params: any) {
    console.log('login', this.apiUrl);
    return this.http
      .post<any>(
        this.apiUrl + '/auth/login',
        params
      )
      .pipe(
        map((data) => {
          if (data && data.data.access_token) {
            console.log('added');
            this._syncUser(data.data);
          }
          return data;
        })
      );
  }


  register(params: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    console.log(this.apiUrl);
    console.log('register');
    return this.http
      .post<any>(
        this.apiUrl + '/player/register?access_token=' + environment.access_token,
        params,
        { headers }
      )
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  refresh() {
    
    if (!this.currentUser || !this.currentUser.refresh_token) {
      // No refresh_token found, cannot refresh
      console.error('No refresh_token found in this.currentUser');
      return;
    }
  
    const refreshToken = this.currentUser.refresh_token;
    const mode = 'refresh_mode';
  
    return this.http
      .post<any>(
        this.apiUrl + '/auth/refresh',
        { refresh_token: refreshToken, mode: mode }
      )
      .pipe(
        map((data) => {
          if (data && data.data.access_token) {
            console.log('Refreshed token added');
            this._syncUser(data.data);
          } else {
            console.log('Token refresh failed');
            // Token refresh failed, remove currentUser
            this.logout();
          }
          return data;
        })
      );
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    if (this.currentUserSubject) {
      this.currentUserSubject.next(null);
    }
    this.router.navigate(['/auth/login']);
  }

  _syncUser(data: any) {
    localStorage.setItem('currentUser', JSON.stringify(data));
    if (this.currentUserSubject) {
      this.currentUserSubject.next(data);
    }
    return true;
  }
}
