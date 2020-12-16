import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ReportesService {

  constructor(
    private http: HttpClient
  ) { }

  proveedoresEnergia(proveedores, fechaInicio, fechaFin) {
    return this.http.post(`${apiUrl}reporte-proveedores?fechai=${fechaInicio}&fechaf=${fechaFin}`, proveedores);
  }

  facturacion(contratos, fechaInicio, fechaFin) {
    return this.http.post(`${apiUrl}reporte-facturacion?fechai=${fechaInicio}&fechaf=${fechaFin}`, contratos);
  }

  produccion(fechaInicio, fechaFin) {
    return this.http.get(`${apiUrl}reporte-inversores?fechai=${fechaInicio}&fechaf=${fechaFin}`);
  }

  validacion(fechaInicio, fechaFin) {
    return this.http.get(`${apiUrl}reporte-validacion?fechai=${fechaInicio}&fechaf=${fechaFin}`);
  }

}
