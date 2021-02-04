import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { ListadoFactura } from '../../Modelos/factura';
import { Router, NavigationExtras } from '@angular/router';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

@Component({
  selector: 'app-facturasEmitidas',
  templateUrl: './facturasEmitidas.component.html',
  styleUrls: ['./facturasEmitidas.component.css']
})
export class FacturasEmitidasComponent implements OnInit {

  listOfCurrentPageData: ListadoFactura[] = [];
  listOfDataFacturas: ListadoFactura[] = [];
  fechas = null;

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService
  ) { }

  verFactura(data) {
    const navigationExtras: NavigationExtras = {
      state: data
    };
    this.router.navigate(['factura'], navigationExtras);
    this.facturaService.ejecutarNavegacion(data);
  }

  ngOnInit() {
  }

  consultar() {
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
        2,
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')} 00:00:00`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')} 00:00:00`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.listOfDataFacturas = data;

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
