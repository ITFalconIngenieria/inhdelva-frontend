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
    return this.http.patch(`${apiUrl}tarifa/${id}`, tarifa);
  }

  getTarifasRelacion() {
    return this.http.get(`${apiUrl}tarifa?filter={"include":[{"relation":"puntoMedicion"},{"relation":"matrizHoraria"}],"where":{"estado":true}}`);
  }

  getPuntoMedicion() {
    return this.http.get(`${apiUrl}punto-medicion`);
  }

  getMatrizHoraria() {
    return this.http.get(`${apiUrl}matriz-horarias?filter={ "fields": { "id": true, "codigo": true, "descripcion": true } }`);
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

  getTarifasParametroRelacion() {
    return this.http.get(`${apiUrl}parametro-tarifas?filter={"include":[{"relation":"tarifa"},{"relation":"tipoCargo"},{"relation":"bloqueHorario"}],"where": {"estado":true,"tarifaId": null } }`);
  }

  getTipoCargo() {
    return this.http.get(`${apiUrl}tipo-cargo`);
  }

  getBloqueHorario(idMH) {
    // tslint:disable-next-line: max-line-length
    return this.http.get(`${apiUrl}bloque-horarios?filter={"where":{"matrizHorariaId":${idMH}},"fields":{"id":true,"descripcion":true}}`);
  }

}
