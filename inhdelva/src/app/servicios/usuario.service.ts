import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient
  ) { }

  getUsuarios() {
    return this.http.get(`${apiUrl}usuarios`);
  }

  postUsuarios(usuarios) {
    return this.http.post(`${apiUrl}signup`, usuarios);
  }

  putUsuarios(id, usuarios) {
    return this.http.put(`${apiUrl}usuarios/${id}`, usuarios);
  }

  deleteUsuarios(id, usuarios) {
    return this.http.patch(`${apiUrl}usuarios/${id}`, usuarios);
  }

}
