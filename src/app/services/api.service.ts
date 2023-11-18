import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  BASE_URL = 'http://localhost:8080';
  //BASE_URL = 'http://172.0.10.39:8080';

  constructor(private http: HttpClient) {}

  sendMessage(parameters: any): Observable<any> {
    const sendMessagePath = `${this.BASE_URL}/health`;
    return this.http.post<any>(sendMessagePath, parameters);
  }
}
