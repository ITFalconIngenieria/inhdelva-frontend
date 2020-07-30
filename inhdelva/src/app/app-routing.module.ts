import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importaciones de componentes
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { FacturaComponent } from "./pages/factura/factura.component"

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: WelcomeComponent,
    children: [
      { path: 'proveedores', component: ProveedoresComponent }
    ]
  },
  // {
  //   path: '',
  //   component: FacturaComponent,
  //   children: [
  //     { path: 'factura', component: FacturaComponent }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
