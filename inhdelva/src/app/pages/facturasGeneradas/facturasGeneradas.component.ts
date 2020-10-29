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
  total: number = 0;
  idFactura;
  idActualizar: any[] = [];
  valoresActualizar: any[] = [];
  valoresAnteriores: any[] = [];

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private router: Router,
    private notification: NzNotificationService
  ) { }

  parserValor = (value: string) => value.replace('Lps ', '');
  formatterValor = (value: number) => `${value} Lps`;

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
      cargoFinancionamiento: [0],
      ajuste: [0],
      cargoCorte: [0],
      recargo: [0],
      otros: [0],
      total: [0],
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
    // tslint:disable-next-line: max-line-length
    this.total = this.total + (this.validateForm.value.cargoFinancionamiento - this.valoresAnteriores[0]) + (this.validateForm.value.ajuste - this.valoresAnteriores[1]) + (this.validateForm.value.cargoCorte - this.valoresAnteriores[2]) + (this.validateForm.value.recargo - this.valoresAnteriores[3]) + (this.validateForm.value.otros - this.valoresAnteriores[4]);

    this.valoresActualizar = [
      `${this.validateForm.value.cargoFinancionamiento}`,
      `${this.validateForm.value.ajuste}`,
      `${this.validateForm.value.cargoCorte}`,
      `${this.validateForm.value.recargo}`,
      `${this.validateForm.value.otros}`,
      `${this.total}`
    ];

    // tslint:disable-next-line: prefer-for-of
    for (let x = 0; x < this.idActualizar.length; x++) {
      this.facturaService.editarFactura(this.idActualizar[x], { valor: this.valoresActualizar[x] })
        .toPromise()
        .then(
          () => {
            for (const item of this.listOfDataFacturas.filter(y => y.id === this.idFactura)) {
              item.total = this.total;
            }

          }
        );
    }

    this.validateForm = this.fb.group({
      cargoFinancionamiento: [0],
      ajuste: [0],
      cargoCorte: [0],
      recargo: [0],
      otros: [0],
    });

    this.ShowNotification(
      'success',
      'Actualizado con éxito',
      'La factura fue actualizada con éxito'
    );
  }

  editarFactura(data): void {
    this.isVisible = true;
    this.idFactura = data.id;
    this.facturaService.getFacturaEditar(data.id)
      .toPromise()
      .then(
        (res: []) => {
          this.dataEditar = res;
          this.validateForm = this.fb.group({
            cargoFinancionamiento: [parseFloat(this.dataEditar[22].valor)],
            ajuste: [parseFloat(this.dataEditar[23].valor)],
            cargoCorte: [parseFloat(this.dataEditar[24].valor)],
            recargo: [parseFloat(this.dataEditar[25].valor)],
            otros: [parseFloat(this.dataEditar[26].valor)],
          });

          this.idActualizar = [
            this.dataEditar[22].id,
            this.dataEditar[23].id,
            this.dataEditar[24].id,
            this.dataEditar[25].id,
            this.dataEditar[26].id,
            this.dataEditar[27].id
          ];

          this.valoresAnteriores = [
            this.dataEditar[22].valor,
            this.dataEditar[23].valor,
            this.dataEditar[24].valor,
            this.dataEditar[25].valor,
            this.dataEditar[26].valor,
          ];
          this.total = this.dataEditar[27].valor;
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
