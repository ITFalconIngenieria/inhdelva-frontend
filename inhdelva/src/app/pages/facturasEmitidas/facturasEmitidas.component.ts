import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { ListadoFactura } from '../../Modelos/factura';
import { Router, NavigationExtras } from '@angular/router';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-facturasEmitidas',
  templateUrl: './facturasEmitidas.component.html',
  styleUrls: ['./facturasEmitidas.component.css']
})
export class FacturasEmitidasComponent implements OnInit {

  listOfCurrentPageData: ListadoFactura[] = [];
  listOfDataFacturas: ListadoFactura[] = [];

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private notification: NzNotificationService
  ) { }

  verFactura(data) {
    const navigationExtras: NavigationExtras = {
      state: data
    };
    this.router.navigate(['factura'], navigationExtras);
    this.facturaService.ejecutarNavegacion(data);
  }

  ngOnInit() {

    this.facturaService.getListadoFacturas(2)
      .toPromise()
      .then(
        (data: ListadoFactura[]) => {
          this.listOfDataFacturas = data;

        },
        (error) => {

          swal({
            icon: 'error',
            title: 'No se pudo conectar al servidor',
            text: 'Revise su conexión a internet o comuníquese con el proveedor.'
          });

          console.log(error);
        }
      );
  }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }


}
