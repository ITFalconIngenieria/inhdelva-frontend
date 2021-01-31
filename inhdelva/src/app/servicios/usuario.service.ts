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

  getAllUsuarios() {
    return this.http.get(`${apiUrl}AllUser`);
  }

  postUsuario(usuario) {
    return this.http.post(`${apiUrl}signup`, usuario);
  }

  postUsuarioRelacion(usuario) {
    return this.http.post(`${apiUrl}AddUser`, usuario);
  }

  putUsuario(usuario) {
    return this.http.put(`${apiUrl}UpdateUser`, usuario);
  }

  deleteUsuario(id, usuario) {
    return this.http.patch(`${apiUrl}usuarios/${id}`, usuario);
  }

}
