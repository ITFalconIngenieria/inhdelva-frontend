import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CargosEspecialesService {

  constructor(
    private http: HttpClient
  ) { }

  getCargosEspeciales() {
    // return this.http.get(`${apiUrl}CargoEspecial`);
    return this.http.get(`${apiUrl}cargos-fijos?filter[where][estado]=true`);
  }

  postCargoEspecial(CargoEspecial) {
    return this.http.post(`${apiUrl}cargos-fijos`, CargoEspecial);
  }

  putCargoEspecial(id, CargoEspecial) {
    return this.http.put(`${apiUrl}cargos-fijos/${id}`, CargoEspecial);
  }

  deleteCargoEspecial(id, CargoEspecial) {
    return this.http.patch(`${apiUrl}cargos-fijos/${id}`, CargoEspecial);
  }

}
