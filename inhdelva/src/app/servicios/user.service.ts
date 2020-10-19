import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  infoLogin: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.infoLogin = JSON.parse(localStorage.getItem('infoUser'));
  }

  validar(infoLogin) {
    return this.http.post(`${apiUrl}users/login`, infoLogin);
  }

  executeLogin(data) {
    localStorage.setItem('infoUser', JSON.stringify(data));
    localStorage.setItem('token', data.token);

    this.infoLogin = JSON.parse(localStorage.getItem('infoUser'));
    return this.infoLogin;
  }

  clearInfoLogin() {
    this.infoLogin = '';
    localStorage.clear();
    this.router.navigate(['/login']);

  }

  getInfoLogin() {
    return this.infoLogin;
  }

  estaLogueado() {
    return (localStorage.getItem('token')) ? true : false;
  }

}
