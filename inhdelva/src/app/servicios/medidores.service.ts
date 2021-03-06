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

    getMedidores(){
      return this.http.get(`${apiUrl}medidor`);
    }

  getMedidoresPME() {
    return this.http.get(`${apiUrl}vmedidores-pme?filter={"where":{"tipo":false}}`);
  }

  postMedidores(medidor) {
    return this.http.post(`${apiUrl}medidor`, medidor);
  }

  putMedidores(id, medidor) {
    return this.http.put(`${apiUrl}medidor/${id}`, medidor);
  }

  deleteMedidores(id, medidor) {
    return this.http.patch(`${apiUrl}medidor/${id}`, medidor);
  }

  busquedadMedidor() {
    return this.http.get(`${apiUrl}vmedidor-pme`);
  }


  // Medidor virtual
  getMedidoreVirtuales() {
    return this.http.get(`${apiUrl}medidor?filter={"where":{"tipo":true}}`);
  }

  getMedidoreVirtualesJoin() {
    return this.http.get(`${apiUrl}medidor-virtuals?filter={ "include": [ { "relation": "medidor" },{ "relation": "medidorVirtual" } ] }`);
  }

  postMedidoreVirtual(medidor) {
    return this.http.post(`${apiUrl}medidor-virtuals`, medidor);
  }

  putMedidoreVirtual(id, medidor) {
    return this.http.put(`${apiUrl}medidor-virtuals/${id}`, medidor);
  }

  deleteMedidoreVirtual(id) {
    return this.http.delete(`${apiUrl}medidor-virtuals/${id}`);
  }

  checkMedidor(id) {
    return this.http.get(`${apiUrl}aprobacion-mv/${id}`);
  }

  // roll-overs?filter[where][medidorId]=1
  // Rollover
  getRollovers() {
    return this.http.get(`${apiUrl}roll-overs?filter[where][estado]=true`);
  }

  getRolloversMedidor(id) {
    return this.http.get(`${apiUrl} roll-overs?filter[where][medidorId]=${id}`);
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
