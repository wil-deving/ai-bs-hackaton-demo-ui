import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  //BASE_URL = 'http://localhost:8080';
  //BASE_URL = 'http://172.0.10.39:8080';
  BASE_URL = 'http://172.0.10.51:8080';

  constructor(private http: HttpClient) {}

  sendMessage(parameters: any): Observable<any> {
    const sendMessagePath = `${this.BASE_URL}/health/chatme`;
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    });
    const requestOptions = { headers: headers };
    return this.http.post<any>(sendMessagePath, parameters, requestOptions);
  }

  getInsuredData(parameters: any): Observable<any> {
    const sendMessagePath = `${this.BASE_URL}/health/policy?documentId=${parameters.docNo}`;

    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*',
    });
    const requestOptions = { headers: headers };
    return this.http.get<any>(sendMessagePath, requestOptions);
  }
}
