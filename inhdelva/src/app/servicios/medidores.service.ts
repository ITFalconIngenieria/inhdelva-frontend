import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;
@Injectable({
  providedIn: 'root'
})
export class MedidoresService {

  constructor(
    private http: HttpClient
  ) { }

  getMedidores() {
    return this.http.get(`${apiUrl}`);
  }

}
