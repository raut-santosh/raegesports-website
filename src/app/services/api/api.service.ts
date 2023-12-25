import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  apiUrl: string = environment.apiUrl;

  constructor(private http: HttpClient) {}

  callApi(
    endpoint: string,
    method: 'get' | 'post' | 'patch' | 'put' | 'delete',
    params: any = {},
    id: string | null = null,
    files: FileList | null = null
  ): Observable<any> {
    const url = `${this.apiUrl}/${endpoint}${id ? `/${id}` : ''}`;

    if (method === 'get') {
      const queryParams = new HttpParams({ fromObject: params });
      return this.http.get(url, { params: queryParams }).pipe(catchError(this.handleError));
    } else if (method === 'post') {
      if (files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i], files[i].name);
        }
        return this.http.post(url, formData).pipe(catchError(this.handleError));
      } else {
        return this.http.post(url, params).pipe(catchError(this.handleError));
      }
    } else if (method === 'put') {
      return this.http.put(url, params).pipe(catchError(this.handleError));
    } else if (method === 'patch') {
      return this.http.patch(url, params).pipe(catchError(this.handleError));
    } else if (method === 'delete') {
      return this.http.delete(url).pipe(catchError(this.handleError));
    } else {
      throw new Error(`Invalid API method for ${endpoint}`);
    }
  }

  public downloadFile(url: string): Observable<Blob> {
    return this.http.get(url, { responseType: 'blob' }).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      errorMessage = `Server-side error: ${error.status}, ${error.error || 'Unknown error'}`;
    }
    return throwError({ success: false, message: errorMessage });
  }
  
}
