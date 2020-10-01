import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { ListadoFactura } from '../../Modelos/factura';
import { Router, NavigationExtras } from '@angular/router';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-facturasGeneradas',
  templateUrl: './facturasGeneradas.component.html',
  styleUrls: ['./facturasGeneradas.component.css']
})
export class FacturasGeneradasComponent implements OnInit {
  listOfSelection = [
    {
      text: 'Select All Row',
      onSelect: () => {
        this.onAllChecked(true);
      }
    },
    {
      text: 'Select Odd Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 !== 0));
        this.refreshCheckedStatus();
      }
    },
    {
      text: 'Select Even Row',
      onSelect: () => {
        this.listOfCurrentPageData.forEach((data, index) => this.updateCheckedSet(data.id, index % 2 === 0));
        this.refreshCheckedStatus();
      }
    }
  ];

  checked = false;
  indeterminate = false;
  listOfCurrentPageData: ListadoFactura[] = [];
  listOfDataFacturas: ListadoFactura[] = [];
  setOfCheckedId = new Set<number>();

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

    this.facturaService.getListadoFacturas(1)
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

  emitirFactura() {
    if (this.setOfCheckedId.size > 0) {
      this.setOfCheckedId.forEach(x => {

        this.facturaService.changeFactura(x, { estado: 2 })
          .toPromise()
          .then(
            () => {
              this.listOfDataFacturas = this.listOfDataFacturas.filter(y => y.id !== x);
              swal({
                icon: 'success',
                text: 'Facturas emitidas'
              });
            },
            (error) => {

              this.ShowNotification(
                'error',
                'No se pudo emitir factura',
                'La factura no se pudo emitir, por favor revise su conexión a internet o comuníquese con el proveedor.'
              );
              console.log(error);
            }
          );
      }
      );
    } else {
      swal({
        icon: 'warning',
        text: 'No selecciono ninguna facturas'
      });
    }

  }

  cancelarFactura(data) {

    this.facturaService.changeFactura(data.id, { estado: 0 })
      .toPromise()
      .then(
        () => {

          this.listOfDataFacturas = this.listOfDataFacturas.filter(x => x.id !== data.id);

          swal({
            icon: 'success',
            text: 'Facturas cancelada'
          });
        },
        (error) => {

          this.ShowNotification(
            'error',
            'No se pudo cancelar factura',
            'La factura no se pudo cancelar, por favor revise su conexión a internet o comuníquese con el proveedor.'
          );
          console.log(error);
        }
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
