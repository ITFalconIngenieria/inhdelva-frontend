import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class RangoFechaService {

  constructor(
    private http: HttpClient
  ) { }


  getRangos() {
    return this.http.get(`${apiUrl}config-facturas?filter[where][Estado]=true`);
  }

  postRango(rango) {
    return this.http.post(`${apiUrl}config-facturas`, rango);
  }

  putRango(id, rango) {
    console.log(`${apiUrl}config-facturas/${id}`, rango);

    return this.http.put(`${apiUrl}config-facturas/${id}`, rango);
  }

  deleteRango(id, rango) {
    return this.http.patch(`${apiUrl}config-facturas/${id}`, rango);
  }

}
