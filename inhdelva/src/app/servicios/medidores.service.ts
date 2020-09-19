import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class MedidoresService {

  constructor(
    private http: HttpClient
  ) { }

  // Medidpres
  getMedidoresPME() {
    return this.http.get(`${apiUrl}vmedidores-pme`);
  }

  postMedidores(medidor) {
    return this.http.post(`${apiUrl}medidor`, medidor);
  }

  updateMedidores(id, medidor) {
    return this.http.put(`${apiUrl}medidor/${id}`, medidor);
  }

  deleteMedidores(id, medidor) {
    return this.http.patch(`${apiUrl}medidor/${id}`, medidor);
  }

  busquedadMedidor(){
    return this.http.get(`${apiUrl}vmedidor-pme`);
  }

  // roll-overs?filter[where][medidorId]=1
  // Rollover
  getRollovers() {
    return this.http.get(`${apiUrl}roll-overs`);
  }

  postRollovers(rollover) {
    return this.http.post(`${apiUrl}roll-overs`, rollover);
  }

  putRollovers(id, rollover) {
    return this.http.put(`${apiUrl}roll-overs/${id}`, rollover);
  }

  deleteRollovers(id, rollover) {
    return this.http.patch(`${apiUrl}roll-overs/${id}`, rollover);
  }

}
