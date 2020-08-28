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

  get(): Observable<any> {

    return forkJoin(
      this.http.get(`${apiUrl}detalle-facturas`),
      this.http.get(`${apiUrl}periodo-facturas`),
      this.http.get(`${apiUrl}origen-electricidad`),
      this.http.get(`${apiUrl}detalle-clientes`),
      this.http.get(`${apiUrl}maestro-facturas`)
    );
  }

}
