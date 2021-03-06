import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, Observable } from 'rxjs';
import * as moment from 'moment';
moment.locale('es');
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

  generarFactura(medidores) {
    return this.http.post(`http://localhost:3002/GenerarFacturas`, [medidores, true]);
  }

  getInfoNavegacion() {
    return this.valores;
  }

  destroyInfo() {
    this.valores = '';
    localStorage.removeItem('dataFactura');
  }

  getListadoFacturas(estado, fechaInicio, fechaFin) {
    // return this.http.get(`${apiUrl}vlistado-facturas?filter[where][Estado]=${estado}`);
    return this.http.get(`${apiUrl}vlistado-facturas?filter={"where":{ "fechaInicio":{ "between":["${fechaInicio}","${fechaFin}"]}, "Estado": ${estado}}}`);

  }

  getDetalleFactura(id, fechaInicio, fechaFin, fechaInicioFac, fechaFinFac, idContrato, idMedidor): Observable<any> {

    return forkJoin(
      this.http.get(`${apiUrl}facturas/${id}?filter={"include":[{"relation":"tarifa"}]}`),
      this.http.get(`${apiUrl}periodo-facturas?filter={"where":{"facturaId":${id}}}`),
      this.http.get(`${apiUrl}vdetalle-factura?filter={"where":{"facturaId":${id}}}`),
      // tslint:disable-next-line: max-line-length
      this.http.get(`${apiUrl}v-historico-energias?filter={ "where":{ "Fecha":{ "between":["${fechaInicio}","${fechaFin}"] }, "Contrato": ${idContrato}, "Medidor": ${idMedidor} }, "fields":{ "Fecha":true, "Energia":true },"order":["Fecha DESC"] }`),
      // tslint:disable-next-line: max-line-length
      this.http.get(`${apiUrl}v-matriz-energia-pros?filter={
        "where":{"and":[
             {"or":[{"FechaInicio":{"lt":"${fechaInicioFac}"}},{"FechaInicio":"${fechaInicioFac}"}]},{"or":[{ "FechaFinal":{"gt":"${fechaInicioFac}"}},{"FechaFinal":"${fechaInicioFac}"}]}]
         },
         "fields":{
             "FechaInicio":false,
             "FechaFinal":false
         },"order":["Id ASC"]
     }`),
      // tslint:disable-next-line: max-line-length
      this.http.get(`${apiUrl}grafico?fechai=${fechaInicioFac}&fechaf=${fechaFinFac}`),
      this.http.get(`${apiUrl}mediciones-mv/${idMedidor}?F1=${fechaInicioFac}&F2=${fechaFinFac}`),

    );
  }

  getFacturaEditar(id) {
    return this.http.get(`${apiUrl}vdetalle-factura?filter={"where":{"facturaId":${id}}}`);
  }

  editarFactura(id, valor) {
    return this.http.patch(`${apiUrl}detalle-facturas/${id}`, valor);
  }

  changeFactura(id, emitir) {
    return this.http.patch(`${apiUrl}facturas/${id}`, emitir);
  }


}
