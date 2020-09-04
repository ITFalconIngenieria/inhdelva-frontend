import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ZonaService {

  constructor(
    private http: HttpClient
  ) { }

  getZonas() {
    return this.http.get(`${apiUrl}zona`);
  }

  postZona(zona) {
    return this.http.post(`${apiUrl}zona`, zona);
  }

  putZona(zona) {
    return this.http.put(`${apiUrl}zona`, zona);
  }


}
