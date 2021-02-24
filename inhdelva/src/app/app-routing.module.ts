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
import { TipoTarifaComponent } from './pages/tipoTarifa/tipoTarifa.component';
import { ParametrosEntradaComponent } from './pages/parametrosEntrada/parametrosEntrada.component';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { MatrizEnergeticaComponent } from './pages/matrizEnergetica/matrizEnergetica.component';
import { FacturaComponent } from './pages/factura/factura.component';
import { LocalizacionComponent } from './pages/localizacion/localizacion.component';
import { CargosEspecialesComponent } from './pages/cargosEspeciales/cargosEspeciales.component';
import { FacturasEmitidasComponent } from './pages/facturasEmitidas/facturasEmitidas.component';
import { FacturasGeneradasComponent } from './pages/facturasGeneradas/facturasGeneradas.component';
import { FacturasCanceladasComponent } from './pages/facturasCanceladas/facturasCanceladas.component';
import { RangoFacturaComponent } from './pages/rangoFactura/rangoFactura.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { ProduccionComponent } from './reportes/produccion/produccion.component';
import { ProveedoresEnergiaComponent } from './reportes/proveedoresEnergia/proveedoresEnergia.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { FacturacionComponent } from './reportes/facturacion/facturacion.component';
import { ValidacionComponent } from './reportes/validacion/validacion.component';
import { LoginGuard } from './servicios/Guards/login.guard';
import { MantenimientoGuard } from './servicios/Guards/mantenimiento.guard';
import { TarifasGuard } from './servicios/Guards/tarifas.guard';
import { ParametrosGuard } from './servicios/Guards/parametros.guard';
import { UsuarioGuard } from './servicios/Guards/usuario.guard';
import { ContratosGuard } from './servicios/Guards/contratos.guard';
import { MatrizGuard } from './servicios/Guards/matriz.guard';
import { FacturasGuard } from './servicios/Guards/facturas.guard';
import { CargosGuard } from './servicios/Guards/cargos.guard';
import { ConfiguracionGuard } from './servicios/Guards/configuracion.guard';
import { ReporteGuard } from './servicios/Guards/reporte.guard';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  {
    path: '',
    component: WelcomeComponent,
    canActivate: [LoginGuard],
    children: [
      { path: 'inicio', component: InicioComponent },
      { path: 'proveedores', component: ProveedoresComponent, canActivate: [MantenimientoGuard] },
      { path: 'clientes', component: ClientesComponent, canActivate: [MantenimientoGuard] },
      { path: 'medidores', component: MedidoresComponent, canActivate: [MantenimientoGuard] },
      { path: 'bloquesHorarios', component: BloquesHorariosComponent, canActivate: [MantenimientoGuard] },
      { path: 'tipoTarifa', component: TipoTarifaComponent, canActivate: [TarifasGuard] },
      { path: 'parametrosEntrada', component: ParametrosEntradaComponent, canActivate: [ParametrosGuard] },
      { path: 'contratos', component: ContratosComponent, canActivate: [ContratosGuard] },
      { path: 'matrizEnergetica', component: MatrizEnergeticaComponent, canActivate: [MatrizGuard] },
      { path: 'ayuda', component: AyudaComponent },
      { path: 'factura', component: FacturaComponent, canActivate: [FacturasGuard] },
      { path: 'localizacion', component: LocalizacionComponent },
      { path: 'cargosEspeciales', component: CargosEspecialesComponent, canActivate: [CargosGuard] },
      { path: 'facturasGeneradas', component: FacturasGeneradasComponent, canActivate: [FacturasGuard] },
      { path: 'facturasEmitidas', component: FacturasEmitidasComponent, canActivate: [FacturasGuard] },
      { path: 'facturasCanceladas', component: FacturasCanceladasComponent, canActivate: [FacturasGuard] },
      { path: 'rangoFactura', component: RangoFacturaComponent, canActivate: [ConfiguracionGuard] },
      { path: 'usuarios', component: UsuariosComponent, canActivate: [UsuarioGuard] },
      ///// Reportes
      { path: 'reporteFacturacion', component: FacturacionComponent, canActivate: [ReporteGuard] },
      { path: 'reporteProduccion', component: ProduccionComponent, canActivate: [ReporteGuard] },
      { path: 'reporteProveedores', component: ProveedoresEnergiaComponent, canActivate: [ReporteGuard] },
      { path: 'reporteValidacion', component: ValidacionComponent, canActivate: [ReporteGuard] }

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
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
