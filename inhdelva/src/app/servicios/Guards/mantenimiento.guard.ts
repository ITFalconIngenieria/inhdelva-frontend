import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MantenimientoGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }

  canActivate() {
    let arryPermisos = JSON.parse(localStorage.getItem('guards'));
    if (arryPermisos[0] === true) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
