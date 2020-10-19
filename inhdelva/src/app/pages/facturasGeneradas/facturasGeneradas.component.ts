import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { ListadoFactura } from '../../Modelos/factura';
import { Router, NavigationExtras } from '@angular/router';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-facturasGeneradas',
  templateUrl: './facturasGeneradas.component.html',
  styleUrls: ['./facturasGeneradas.component.css']
})
export class FacturasGeneradasComponent implements OnInit {
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

  isVisible = false;
  checked = false;
  validateForm: FormGroup;
  indeterminate = false;
  listOfCurrentPageData: ListadoFactura[] = [];
  listOfDataFacturas: ListadoFactura[] = [];
  setOfCheckedId = new Set<number>();
  dataEditar: any[] = [];

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private router: Router,
    private notification: NzNotificationService
  ) { }

  parserValor = (value: string) => value.replace('L ', '');
  formatterValor = (value: number) => `L ${value}`;

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  verFactura(data) {

    const dataNavegacion: any = {
      ...data,
      pag: 'G'
    };
    const navigationExtras: NavigationExtras = {
      state: dataNavegacion
    };

    this.router.navigate(['factura'], navigationExtras);
    this.facturaService.ejecutarNavegacion(dataNavegacion);
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


    this.validateForm = this.fb.group({
      cargoFinancionamiento: [0, [Validators.required]],
      ajuste: [0, [Validators.required]],
      cargoCorte: [0, [Validators.required]],
      recargo: [0, [Validators.required]],
      otros: [0, [Validators.required]],
      subtotal: [0, [Validators.required]],
      total: [0, [Validators.required]],
    });

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

  guardar() {

  }

  editarFactura(data): void {
    this.isVisible = true;
    console.log(data);

    this.facturaService.getFacturaEditar(data.id)
      .toPromise()
      .then(
        (res: []) => {
          console.log(res);
          this.dataEditar = res;
          this.validateForm = this.fb.group({
            cargoFinancionamiento: [0, [Validators.required]],
            ajuste: [0, [Validators.required]],
            cargoCorte: [0, [Validators.required]],
            recargo: [0, [Validators.required]],
            otros: [0, [Validators.required]],
            subtotal: [0, [Validators.required]],
            total: [0, [Validators.required]],
          });
        }
      );
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
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
