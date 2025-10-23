import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BaseService {
  private readonly http = inject(HttpClient);

  constructor() { }

  public get apiUrl(): string { return "https://jsonplaceholder.typicode.com/"; }

  post<T>(url?: string, body?: any, params?: {}): Observable<any> {
    return this.http.post<T>(`${this.apiUrl}${url}`, body, { params });
  }

  get<T>(url?: string, params?: any): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${url}`, { params });
  }

}
