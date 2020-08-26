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

getActores(){
  this.http.get(`${apiUrl}actores`);
}


}
