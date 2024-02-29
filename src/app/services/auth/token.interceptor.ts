import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../api/api.service';
@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private apiService: ApiService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.shouldSkipTokenInterceptor(request)) {
      return next.handle(request);
    }
    // add authorization header with jwt token if available
    let currentUser = this.apiService.currentUserValue;
    console.log(this.apiService.currentUserValue);
    let token = currentUser?.session.access_token ?? currentUser?.token;
    console.log('token = ',token);
    if (
      currentUser &&
      token &&
      request.url.includes(this.apiService.apiUrl) &&
      !request.url.includes('/auth')
    ) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });

      // this.apiService.globalloading=true;
    }

    return next.handle(request);
  }

  private shouldSkipTokenInterceptor(request: HttpRequest<any>): boolean {
    // Check if the request URL and method match any route in the array

    const routesToSkipTokenInterceptor = [
      { url: '/auth', methods: [] }, // Skip for all methods for /auth
      { url: '/games', methods: ['GET'] }, // Skip only for GET method for /games
      {url: '/members', methods: ['GET'] }, // Skip only for GET method for /}
      // {url: '/tournaments', methods: ['GET'] }, // Skip only for GET method for /}
      {url: '/match_highlights', methods: ['GET'] }, // Skip only for GET method for /}
      {url: '/blogs', methods: ['GET'] }, // Skip only for GET method for /}
      {url: '/news', methods: ['GET'] }, // Skip only for GET method for /}
      {url: '/contact_us', methods: ['GET'] }, // Skip only for GET method for /}
      {url: '/contact_us', methods: ['POST'] }, // Skip only for GET method for /}
      // Add more routes as needed
    ];


    return routesToSkipTokenInterceptor.some(route => {
      const urlMatches = request.url.includes(route.url);
      const methodMatches = route.methods.length === 0 || route.methods.includes(request.method!);
      return urlMatches && methodMatches;
    });
  }
}