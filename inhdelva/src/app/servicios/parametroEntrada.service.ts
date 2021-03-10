import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ParametroEntradaService {

  constructor(
    private http: HttpClient
  ) { }

  // Parametro
  getParametro() {
    return this.http.get(`${apiUrl}parametro-tarifas?filter={"where": {"tarifaId": null } }`);
  }

  postParametro(Parametro) {
    return this.http.post(`${apiUrl}parametro-tarifas`, Parametro);
  }

  putParametro(id, Parametro) {
    return this.http.put(`${apiUrl}parametro-tarifas/${id}`, Parametro);
  }

  deleteParametro(id, Parametro) {
    return this.http.patch(`${apiUrl}parametro-tarifas/${id}`, Parametro);
  }

  getParametroRelacion() {
    return this.http.get(`${apiUrl}parametro-tarifas?filter={"include":[{"relation":"tarifa"},{"relation":"tipoCargo"},{"relation":"bloqueHorario"}],"where": {"estado":true,"tarifaId": null }, "order": "fechaFinal DESC"}`);
  }

}
