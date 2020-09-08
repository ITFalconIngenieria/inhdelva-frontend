import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ActoresService {

  constructor(
    private http: HttpClient
  ) { }

  getClientes() {
    return this.http.get(`${apiUrl}actores-sap?filter={"where":%20{"TipoActor":%20false}}`);
  }

  getProveedores() {
    return this.http.get(`${apiUrl}actores-sap?filter={"where":%20{"TipoActor":%20true}}`);
  }

  busquedad(){
    return this.http.get(`${apiUrl}actor-sap`);
  }

}
