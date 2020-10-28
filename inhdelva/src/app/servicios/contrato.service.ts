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
    return this.http.get(`${apiUrl}tipo-servicios`);
  }
}
