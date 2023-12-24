import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private localStorageKey = 'currentUser';

  constructor(private http: HttpClient) {}

  login({ email, password }: any): Observable<any> {
    const body = {
      email,
      password,
    };

    return this.http.post(`${this.apiUrl}/auth/login`, body).pipe(
      tap((response) => this.handleAuthentication(response)),
      switchMap(() => this.getUserDetails()), // Fetch user details after login
      catchError((error) => throwError(error))
    );
  }

  register({
    first_name,
    last_name,
    location,
    email,
    mobile,
    password,
  }: any): Observable<any> {
    const body = {
      first_name,
      last_name,
      location,
      email,
      mobile,
      password,
    };

    return this.http.post(`${this.apiUrl}/player/register`, body).pipe(
      map((data) => {
        return data;
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/refresh`, {}).pipe(
      tap((response) => this.handleAuthentication(response)),
      catchError((error) => throwError(error))
    );
  }

  logout(): void {
    localStorage.removeItem(this.localStorageKey);
  }

  get currentUser(): any {
    const storedUser = localStorage.getItem(this.localStorageKey);
    
    // If currentUser is not available in storage, return a fake object
    return storedUser ? JSON.parse(storedUser) : { user: { first_name: "Guest", last_name: "User" } };
  }
  

  private handleAuthentication(response: any): void {
    console.log('handling:', response);
    const { access_token, expires, refresh_token, user } = response.data;

    const currentUser = {
      access_token,
      expires,
      refresh_token,
      user,
    };

    localStorage.setItem(this.localStorageKey, JSON.stringify(currentUser));
  }

  private getUserDetails(): Observable<any> {
    const currentUser = this.currentUser;

    if (!currentUser || !currentUser.access_token) {
      return throwError('Access token is missing.');
    }

    const headers = {
      Authorization: `Bearer ${currentUser.access_token}`,
    };

    return this.http.get(`${this.apiUrl}/users/me`, { headers }).pipe(
      tap((userDetails) => this.updateUserDetails(userDetails)),
      catchError((error) => throwError(error))
    );
  }

  private updateUserDetails(userDetails: any): void {
    const currentUser = this.currentUser;
    currentUser.user = userDetails.data; // Assuming the user details are inside 'data'
    localStorage.setItem(this.localStorageKey, JSON.stringify(currentUser));
  }

  get getAvtar() {
    if (this.currentUser && this.currentUser.user && this.currentUser.user.avatar) {
      return `${this.apiUrl}/assets/${this.currentUser.user.avatar}?access_token=${this.currentUser.access_token}`;
    } else {
      return `assets/img/logo/avatar.png`;
    }
  }
  

  updateAvatar(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    const fileId = this.currentUser.user.avatar;
      const patchEndpoint = `${this.apiUrl}/files/${fileId}`;
      // Perform the PATCH request
      return this.http.patch(patchEndpoint, formData).pipe(
        catchError((error) => {
          console.error('Error updating file:', error);
          return throwError(error);
        })
      );
  }
}
