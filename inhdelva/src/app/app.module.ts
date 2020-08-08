import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppComponent } from './app.component';
import { IconsProviderModule } from './icons-provider.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';

// config angular i18n
import { registerLocaleData, CommonModule } from '@angular/common';
import en from '@angular/common/locales/en';

// Importaciones de componentes ng-zorro
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCalendarModule } from 'ng-zorro-antd/calendar';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzRadioModule } from 'ng-zorro-antd/radio';

// Importaciones de componentes
import { LoginComponent } from './login/login.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ProveedoresComponent } from './pages/proveedores/proveedores.component';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { MedidoresComponent } from './pages/medidores/medidores.component';
import { BloquesHorariosComponent } from './pages/bloquesHorarios/bloquesHorarios.component';
import { TarifaHorariaComponent } from './pages/tarifaHoraria/tarifaHoraria.component';
import { TarifaMonimicaComponent } from './pages/tarifaMonimica/tarifaMonimica.component';
import { ParametrosEntradaComponent } from './pages/parametrosEntrada/parametrosEntrada.component';
import { ContratosComponent } from './pages/contratos/contratos.component';
import { MatrizEnergeticaComponent } from './pages/matrizEnergetica/matrizEnergetica.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { AyudaComponent } from './pages/ayuda/ayuda.component';
import { FacturaComponent } from './pages/factura/factura.component';
import { LocalizacionComponent } from './pages/localizacion/localizacion.component';

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    WelcomeComponent,
    AyudaComponent,
    InicioComponent,
    ClientesComponent,
    ProveedoresComponent,
    MedidoresComponent,
    BloquesHorariosComponent,
    TarifaHorariaComponent,
    TarifaMonimicaComponent,
    ParametrosEntradaComponent,
    ContratosComponent,
    MatrizEnergeticaComponent,
    FacturaComponent,
    LocalizacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    /////////////////
    IconsProviderModule,
    // NgZorroAntdModule,
    NzCardModule,
    NzGridModule,
    NzLayoutModule,
    NzTableModule,
    NzMenuModule,
    NzDropDownModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzDrawerModule,
    NzRadioModule,
    NzFormModule,
    NzSelectModule,
    NzInputNumberModule,
    NzInputModule,
    NzAlertModule,
    NzSwitchModule,
    NzMessageModule,
    NzNotificationModule,
    NzPaginationModule,
    NzCheckboxModule,
    NzDatePickerModule,
    NzTimePickerModule,
    NzEmptyModule,
    NzListModule,
    NzStatisticModule,
    NzDividerModule,
    NzSpinModule,
    NzCalendarModule,
    NzToolTipModule,

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule { }
