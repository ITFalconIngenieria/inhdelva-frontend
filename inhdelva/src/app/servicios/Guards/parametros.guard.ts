import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ParametrosGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }

  canActivate() {
    let arryPermisos = JSON.parse(localStorage.getItem('guards'));
    if (arryPermisos[2] === true) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
