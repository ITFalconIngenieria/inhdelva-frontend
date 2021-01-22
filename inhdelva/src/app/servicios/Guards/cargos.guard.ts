import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CargosGuard implements CanActivate {

  constructor(
    private router: Router
  ) { }

  canActivate() {
    let arryPermisos = JSON.parse(localStorage.getItem('guards'));
    if (arryPermisos[5] === true) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

}
