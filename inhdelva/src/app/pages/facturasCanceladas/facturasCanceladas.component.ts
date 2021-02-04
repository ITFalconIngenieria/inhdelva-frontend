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

  listOfSelection = [
    {
      text: 'Selecciona todas la filas',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Seleccionar fila impar',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Seleccionar fila par',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];
  fechas = null;

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: ListadoFactura[] = [];
  listOfDataFacturas: ListadoFactura[] = [];
  setOfCheckedId = new Set<number>();

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
        0,
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

  generarFactura(data) {

  }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }

  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
    console.log(id);

  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: ListadoFactura[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }


}
