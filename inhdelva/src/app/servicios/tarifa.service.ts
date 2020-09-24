import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class TarifaService {

  constructor(
    private http: HttpClient
  ) { }

  // Tarifa
  getTarifas() {
    return this.http.get(`${apiUrl}tarifa?filter[where][estado]=true`);
  }

  postTarifa(tarifa) {
    return this.http.post(`${apiUrl}tarifa`, tarifa);
  }

  putTarifa(id, tarifa) {
    return this.http.put(`${apiUrl}tarifa/${id}`, tarifa);
  }

  deleteTarifa(id, tarifa) {
    return this.http.patch(`${apiUrl}Tarifa/${id}`, tarifa);
  }

  // Tarifa Parametros
  getTarifasParametro() {
    return this.http.get(`${apiUrl}parametro-tarifas?filter[where][estado]=true`);
  }

  postTarifaParametro(tarifa) {
    return this.http.post(`${apiUrl}parametro-tarifas`, tarifa);
  }

  putTarifaParametro(id, tarifa) {
    return this.http.put(`${apiUrl}parametro-tarifas/${id}`, tarifa);
  }

  deleteTarifaParametro(id, tarifa) {
    return this.http.patch(`${apiUrl}parametro-tarifas/${id}`, tarifa);
  }

}
