import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class LocalizacionService {

  constructor(
    private http: HttpClient
  ) { }

  getLocalizacion() {
    return this.http.get(`${apiUrl}localizacion`);
  }

  postLocalizacion(localizacion) {
    return this.http.post(`${apiUrl}localizacion/`, localizacion);
  }

  putLocalizacion(localizacion) {
    return this.http.put(`${apiUrl}localizacion/`, localizacion);
  }

  deleteLocalizacion(localizacion) {
    return this.http.patch(`${apiUrl}localizacion/`, localizacion);
  }
}
