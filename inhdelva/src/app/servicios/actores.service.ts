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

  postClientes(cliente) {
    return this.http.post(`${apiUrl}actores`, cliente);
  }

  putClientes(id, cliente) {
    return this.http.put(`${apiUrl}actores/${id}`, cliente);
  }

  delteClientes(id, data) {
    return this.http.patch(`${apiUrl}actores/${id}`, data);
  }

  getProveedores() {
    return this.http.get(`${apiUrl}actores-sap?filter={"where":%20{"TipoActor":%20true}}`);
  }

  busquedad() {
    return this.http.get(`${apiUrl}actor-sap`);
  }

}
