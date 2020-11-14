import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  valores: any;

  constructor(
    private http: HttpClient
  ) {
    this.valores = JSON.parse(localStorage.getItem('dataFactura'));
  }

  ejecutarNavegacion(data) {
    localStorage.setItem('dataFactura', JSON.stringify(data));

    this.valores = JSON.parse(localStorage.getItem('dataFactura'));
    return this.valores;
  }

  getInfoNavegacion() {
    return this.valores;
  }

  destroyInfo() {
    this.valores = '';
    localStorage.removeItem('dataFactura');
  }

  getListadoFacturas(id) {
    return this.http.get(`${apiUrl}vlistado-facturas?filter[where][Estado]=${id}`);
  }

  getDetalleFactura(id, fechaInicio, fechaFin, idContrato, idMedidor): Observable<any> {

    console.log(`${apiUrl}v-historico-energias?filter={ "where":{ "Fecha":{ "between":["${fechaInicio}","${fechaFin}"] }, "Contrato": ${idContrato}, "Medidor": ${idMedidor} }, "fields":{ "Fecha":true, "Energia":true },"order":["Fecha DESC"] }`);

    return forkJoin(
      this.http.get(`${apiUrl}facturas/${id}`),
      this.http.get(`${apiUrl}periodo-facturas?filter={"where":{"facturaId":${id}}}`),
      this.http.get(`${apiUrl}vdetalle-factura?filter={"where":{"facturaId":${id}}}`),
      // tslint:disable-next-line: max-line-length
      this.http.get(`${apiUrl}v-historico-energias?filter={ "where":{ "Fecha":{ "between":["${fechaInicio}","${fechaFin}"] }, "Contrato": ${idContrato}, "Medidor": ${idMedidor} }, "fields":{ "Fecha":true, "Energia":true },"order":["Fecha DESC"] }`),
      // tslint:disable-next-line: max-line-length
      this.http.get(`${apiUrl}v-matriz-energia-pros?filter={ "where":{"and":[ {"FechaInicio":{"lt":"2020-12-01T00:00:00.000Z"}},{ "FechaFinal":{"gt":"2020-12-01T00:00:00.000Z"}}] }, "fields":{ "FechaInicio":false, "FechaFinal":false },"order":["Id ASC"] }`),
      this.http.get(`${apiUrl}grafico?fechai=2020-10-01%2006%3A00%3A00&fechaf=2020-11-01%2006%3A00%3A00`)

    );
  }

  getFacturaEditar(id) {
    return this.http.get(`${apiUrl}vdetalle-factura?filter={"where":{"facturaId":${id}}}`); 10
  }

  editarFactura(id, valor) {
    return this.http.patch(`${apiUrl}detalle-facturas/${id}`, valor);
  }

  changeFactura(id, emitir) {
    return this.http.patch(`${apiUrl}facturas/${id}`, emitir);
  }


}
