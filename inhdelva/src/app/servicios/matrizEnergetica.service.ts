import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin, Observable } from 'rxjs';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class MatrizEnergeticaService {

  constructor(
    private http: HttpClient
  ) { }

  // Matriz energetica
  getMatriz() {
    return this.http.get(`${apiUrl}matriz-energeticas`);
  }

  postMatriz(matriz) {
    return this.http.post(`${apiUrl}matriz-energeticas`, matriz);
  }

  putMatriz(id, matriz) {
    return this.http.put(`${apiUrl}matriz-energeticas/${id}`, matriz);
  }

  deleteMatriz(id, matriz) {
    return this.http.patch(`${apiUrl}matriz-energeticas/${id}`, matriz);
  }

  // Distribucion
  getDistribucion() {
    return this.http.get(`${apiUrl}distribucion-energias`);
  }

  postDistribucion(distribucion) {
    return this.http.post(`${apiUrl}distribucion-energias`, distribucion);
  }

  putDistribucion(id, distribucion) {
    return this.http.put(`${apiUrl}distribucion-energias/${id}`, distribucion);
  }

  deleteDistribucion(id, distribucion) {
    return this.http.patch(`${apiUrl}distribucion-energias/${id}`, distribucion);
  }

  getOrigenes() {
    return this.http.get(`${apiUrl}origen`);
  }

  getArregloDatos(): Observable<any> {
    return forkJoin(
      this.http.get(`${apiUrl}matriz-energeticas`),
      this.http.get(`${apiUrl}distribucion-energias`)
    );
  }

}
