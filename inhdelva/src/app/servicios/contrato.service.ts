import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  constructor(
    private http: HttpClient
  ) { }

  // Contratos
  getContratos() {
    // return this.http.get(`${apiUrl}contrato`);
    return this.http.get(`${apiUrl}contrato?filter[where][estado]=true`);
  }

  getContratosRelacion() {
    return this.http.get(`${apiUrl}contrato?filter={"include":[{"relation":"actor"}],"where":{"estado":true}}`);
  }

  getAllContratos() {
    // return this.http.get(`${apiUrl}contrato`);
    return this.http.get(`${apiUrl}contrato`);
  }

  postContrato(contrato) {
    return this.http.post(`${apiUrl}contrato`, contrato);
  }

  putContrato(id, contrato) {
    return this.http.put(`${apiUrl}contrato/${id}`, contrato);
  }

  deleteContrato(id, contrato) {
    return this.http.patch(`${apiUrl}contrato/${id}`, contrato);
  }

  // Contratos-Medidores
  getContratosMedidor() {
    return this.http.get(`${apiUrl}contratos-medidores?filter[where][estado]=true`);
  }

  getContratosMedidorRelacion() {
    return this.http.get(`${apiUrl}contratos-medidores?filter={"include":[{"relation":"medidor"},{"relation":"tarifa"},{"relation":"zona"},{"relation":"contrato"},{"relation":"tipoServicio"}],"where":{"estado":true}}`);
  }

  getContratosMedidorID(id) {
    return this.http.get(`${apiUrl}contratos-medidores?filter[where][contratoId]=${id}`);
  }

  postContratoMedidor(contrato) {
    return this.http.post(`${apiUrl}contratos-medidores`, contrato);
  }

  putContratoMedidor(id, contrato) {
    return this.http.put(`${apiUrl}contratos-medidores/${id}`, contrato);
  }

  deleteContratoMedidor(id, contrato) {
    return this.http.patch(`${apiUrl}contratos-medidores/${id}`, contrato);
  }

  getTipoServicio() {
    return this.http.get(`${apiUrl}tipo-servicio`);
  }
}
