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

  getDetalleFactura(id): Observable<any> {
    return forkJoin(
      this.http.get(`${apiUrl}facturas/${id}`),
      this.http.get(`${apiUrl}periodo-facturas?filter={"where":{"facturaId":${id}}}`),
      this.http.get(`${apiUrl}vdetalle-factura?filter={"where":{"facturaId":${id}}}`)
    );
  }

  getFacturaEditar(id) {
    return this.http.get(`${apiUrl}vdetalle-factura?filter={"where":{"facturaId":${id}}}`);10
  }

  editarFactura(id, valor) {
    return this.http.patch(`${apiUrl}detalle-facturas/${id}`, valor);
  }

  changeFactura(id, emitir) {
    return this.http.patch(`${apiUrl}facturas/${id}`, emitir);
  }


}
