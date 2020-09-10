import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class FacturaService {


  constructor(
    private http: HttpClient
  ) { }

  getListadoFacturas() {
    return this.http.get(`${apiUrl}vlistado-facturas`);
  }

  getDetalleFactura(): Observable<any> {
    return forkJoin(
      this.http.get(`${apiUrl}facturas`),
      this.http.get(`${apiUrl}periodo-facturas?filter={"where":{"facturaId":1}}`),
      this.http.get(`${apiUrl}vdetalle-factura?filter={"where":{"facturaId":1}}`)
    );
  }

}
