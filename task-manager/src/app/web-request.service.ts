import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class WebRequestService {
  readonly ROOT_URL;

  constructor(private http: HttpClient) {
    this.ROOT_URL = 'http://localhost:3000/api';
  }

  post(url: string, payload: Object) {
    const headers = this.setAuthentication();
    return this.http.post(`${this.ROOT_URL}/${url}`, payload, { headers });
  }

  getAll(url: string, ownerId: string) {
    const options = { headers: this.setAuthentication() };
    return this.http.get(`${this.ROOT_URL}/${url}/${ownerId}`, options);
  }

  deleteList(url: string) {
    const options = { headers: this.setAuthentication() };
    return this.http.delete(`${this.ROOT_URL}/${url}`, options);
  }

  getById(url: string) {
    const options = { headers: this.setAuthentication() };
    return this.http.get(`${this.ROOT_URL}/${url}`, options);
  }

  createTeask(url: string, payload: Object) {
    const headers = this.setAuthentication();
    return this.http.post(`${this.ROOT_URL}/${url}`, payload, { headers });
  }

  deleteTask(url: string) {
    const options = { headers: this.setAuthentication() };
    return this.http.delete(`${this.ROOT_URL}/${url}`, options);
  }

  completeTask(url: string, payload: Object) {
    const headers = this.setAuthentication();
    return this.http.put(`${this.ROOT_URL}/${url}`, payload, { headers });
  }

  setAuthentication(): HttpHeaders {
    let headers = new HttpHeaders();
    if (localStorage.getItem('accessToken')) {
      headers = headers.set(
        'Authorization',
        `Bearer ${localStorage.getItem('accessToken')}`
      );
    }
    return headers;
  }
}
