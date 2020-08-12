import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Importaciones de componentes
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { MedidoresComponent } from './pages/medidores/medidores.component';
import { BloquesHorariosComponent } from './pages/bloquesHorarios/bloquesHorarios.component';
import { TarifaHorariaComponent } from './pages/tarifaHoraria/tarifaHoraria.component';
import { TipoTarifaComponent } from './pages/tipoTarifa/tipoTarifa.component';
import { ParametrosEntradaComponent } from './pages/parametrosEntrada/parametrosEntrada.component';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { MatrizEnergeticaComponent } from './pages/matrizEnergetica/matrizEnergetica.component';
import { FacturaComponent } from './pages/factura/factura.component';
import { LocalizacionComponent } from './pages/localizacion/localizacion.component';
import { CargosEspecialesComponent } from './pages/cargosEspeciales/cargosEspeciales.component';
import { FacturasEmitidasComponent } from './pages/facturasEmitidas/facturasEmitidas.component';
import { FacturasGeneradasComponent } from './pages/facturasGeneradas/facturasGeneradas.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: WelcomeComponent,
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'proveedores', component: ProveedoresComponent },
      { path: 'clientes', component: ClientesComponent },
      { path: 'medidores', component: MedidoresComponent },
      { path: 'bloquesHorarios', component: BloquesHorariosComponent },
      { path: 'tipoTarifa', component: TipoTarifaComponent },
      { path: 'tarifaHoraria', component: TarifaHorariaComponent },
      { path: 'parametrosEntrada', component: ParametrosEntradaComponent },
      { path: 'contratos', component: ContratosComponent },
      { path: 'matrizEnergetica', component: MatrizEnergeticaComponent },
      { path: 'ayuda', component: AyudaComponent },
      { path: 'factura', component: FacturaComponent},
      { path: 'localizacion', component: LocalizacionComponent},
      { path: 'cargosEspeciales', component: CargosEspecialesComponent},
      { path: 'facturasGeneradas', component: FacturasGeneradasComponent},
      { path: 'facturasEmitidas', component: FacturasEmitidasComponent}

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
