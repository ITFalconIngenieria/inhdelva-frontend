import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { ListadoFactura } from '../../Modelos/factura';
import { Router, NavigationExtras } from '@angular/router';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-facturasCanceladas',
  templateUrl: './facturasCanceladas.component.html',
  styleUrls: ['./facturasCanceladas.component.css']
})
export class FacturasCanceladasComponent implements OnInit {

  fechas = null;
  listOfDataFacturas: ListadoFactura[] = [];

  searchValue = '';
  visible = false;
  listOfDisplayData: any[] = [];

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService

  ) { }

  verFactura(data) {
    const dataNavegacion: any = {
      ...data,
      pag: 'C'
    };
    const navigationExtras: NavigationExtras = {
      state: dataNavegacion
    };

    this.router.navigate(['factura'], navigationExtras);
    this.facturaService.ejecutarNavegacion(dataNavegacion);
  }

  ngOnInit() {
    this.listOfDataFacturas = [];
    this.listOfDisplayData = [];
    if (JSON.parse(localStorage.getItem('dataFC'))) {
      this.listOfDataFacturas = JSON.parse(localStorage.getItem('dataFC'));
      this.listOfDisplayData = [...this.listOfDataFacturas];
    }
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDataFacturas.filter((item: any) => (item.codigo.indexOf(this.searchValue) !== -1) || (item.contrato.indexOf(this.searchValue) !== -1) || (item.cliente.indexOf(this.searchValue) !== -1));
  }

  consultar() {
    this.listOfDataFacturas = [];
    this.listOfDisplayData = [];

    this.spinner.show();
    if (this.fechas === null) {
      this.spinner.hide();

      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un rango de fechas'
      });
    } else {
      this.facturaService.getListadoFacturas(
        0,
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')} 00:00:00`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')} 00:00:00`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.listOfDataFacturas = data;
            this.listOfDisplayData = [...this.listOfDataFacturas];

            localStorage.setItem('dataFC', JSON.stringify(this.listOfDataFacturas));

            if (this.listOfDataFacturas.length <= 0) {
              swal({
                icon: 'error',
                title: 'No se encontraron facturas',
                text: 'Por favor revise la fecha que ha consultado'
              });

              this.spinner.hide();

            }
            this.spinner.hide();

            console.log(data);

          },
          (error) => {
            this.spinner.hide();
            swal({
              icon: 'error',
              title: 'No se pudo conectar al servidor',
              text: 'Revise su conexión a internet o comuníquese con el proveedor.'
            });

            console.log(error);
          }
        );
    }
  }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }

}
