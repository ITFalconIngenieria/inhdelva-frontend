import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

const apiUrl = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class BloqueHorarioService {

  constructor(
    private http: HttpClient
  ) { }

  vistaMatrizHoraria() {
    return this.http.get(`${apiUrl}vmatriz-horaria`);
  }

  // Matriz horaria
  getMatrizHoraria() {
    return this.http.get(`${apiUrl}matriz-horarias`);
  }

  postMatrizHoraria(matriz) {
    return this.http.post(`${apiUrl}matriz-horarias`, matriz);
  }

  putMatrizHoraria(id, matriz) {
    return this.http.put(`${apiUrl}matriz-horarias/${id}`, matriz);
  }

  deleteMatrizHoraria(id, matriz) {
    return this.http.patch(`${apiUrl}matriz-horarias/${id}`, matriz);
  }

  // Bloque horario
  getBloqueHorario() {
    return this.http.get(`${apiUrl}bloque-horarios`);
  }

  postBloqueHorario(bloque) {
    return this.http.post(`${apiUrl}bloque-horarios`, bloque);
  }

  putBloqueHorario(id, bloque) {
    return this.http.put(`${apiUrl}bloque-horarios/${id}`, bloque);
  }

  deleteBloqueHorario(id, bloque) {
    return this.http.patch(`${apiUrl}bloque-horarios/${id}`, bloque);
  }

  // Periodo
  getPeriodo() {
    return this.http.get(`${apiUrl}periodos`);
  }

  postPeriodo(periodo) {
    return this.http.post(`${apiUrl}periodos`, periodo);
  }

  putPeriodo(id, periodo) {
    return this.http.put(`${apiUrl}periodos/${id}`, periodo);
  }

  deletePeriodo(id, periodo) {
    return this.http.patch(`${apiUrl}periodos/${id}`, periodo);
  }

  // Clase de dia 
  getClaseDia() {
    return this.http.get(`${apiUrl}clase-dias`);
  }

  postClaseDia(claseDia) {
    return this.http.post(`${apiUrl}clase-dias`, claseDia);
  }

  putClaseDia(id, claseDia) {
    return this.http.put(`${apiUrl}clase-dias/${id}`, claseDia);
  }

  deleteClaseDia(id, claseDia) {
    return this.http.patch(`${apiUrl}clase-dias/${id}`, claseDia);
  }

  // Clase de dia --- Dia Semana
  getDiaSemana() {
    return this.http.get(`${apiUrl}dias-semanas`);
  }

  postDiaSemana(diaSemana) {
    return this.http.post(`${apiUrl}dias-semanas`, diaSemana);
  }

  putDiaSemana(id, diaSemana) {
    return this.http.put(`${apiUrl}dias-semanas/${id}`, diaSemana);
  }

  deleteDiaSemana(id, diaSemana) {
    return this.http.patch(`${apiUrl}dias-semanas/${id}`, diaSemana);
  }

  // Clase de dia --- Feriados
  getFeriados() {
    return this.http.get(`${apiUrl}feriados`);
  }

  postFeriados(feriado) {
    return this.http.post(`${apiUrl}feriados`, feriado);
  }

  putFeriados(id, feriado) {
    return this.http.put(`${apiUrl}feriados/${id}`, feriado);
  }

  deleteFeriados(id, feriado) {
    return this.http.patch(`${apiUrl}feriados/${id}`, feriado);
  }

    // Horario
    getHorario() {
      return this.http.get(`${apiUrl}horarios`);
    }
  
    postHorario(horario) {
      return this.http.post(`${apiUrl}horarios`, horario);
    }
  
    putHorario(id, horario) {
      return this.http.put(`${apiUrl}horarios/${id}`, horario);
    }
  
    deleteHorario(id, horario) {
      return this.http.patch(`${apiUrl}horarios/${id}`, horario);
    }

}
