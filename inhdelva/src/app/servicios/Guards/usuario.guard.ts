import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UsuarioGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }

  canActivate() {
    let permiso = (localStorage.getItem('permiso') === 'false') ? true : false;
    console.log(permiso);
    
    if (permiso) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}
