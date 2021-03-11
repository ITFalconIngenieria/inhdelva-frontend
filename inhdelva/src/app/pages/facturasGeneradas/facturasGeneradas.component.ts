import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { ListadoFactura } from '../../Modelos/factura';
import { Router, NavigationExtras } from '@angular/router';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';

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
    }
  ];

  listOfSelectionMedidor = [
    {
      text: 'Selecciona todos los medidores',
      onSelect: () => {
        this.onAllCheckedMedidor(true);
      }
    }
  ];
  fechas = null;
  visibleEF = true;
  isVisible = false;
  checked = false;
  checkedM = false;
  indeterminateM = false;
  validateForm: FormGroup;
  indeterminate = false;
  listOfCurrentPageDataM: any[] = [];
  setOfCheckedIdM = new Set<number>();
  listOfCurrentPageData: any[] = [];
  listOfDataFacturas: any[] = [];
  setOfCheckedId = new Set<number>();
  dataEditar: any[] = [];
  total: number = 0;
  idFactura;
  idActualizar: any[] = [];
  valoresActualizar: any[] = [];
  valoresAnteriores: any[] = [];
  searchValue = '';
  visible = false;
  listOfDisplayData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private facturaService: FacturaService,
    private router: Router,
    private notification: NzNotificationService,
    private spinner: NgxSpinnerService

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

  exportarFacturas() {
    const dataNavegacion: any = {
      pag: 'G',
      dataFacturas: [...this.listOfDataFacturas]
    };
    const navigationExtras: NavigationExtras = {
      state: dataNavegacion
    };

    this.router.navigate(['exportarFactura'], navigationExtras);
    this.facturaService.ejecutarNavegacion(dataNavegacion);
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

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDataFacturas.filter((item: any) => (item.codigo.indexOf(this.searchValue) !== -1) || (item.contrato.indexOf(this.searchValue) !== -1) || (item.cliente.indexOf(this.searchValue) !== -1));
  }

  ngOnInit() {

    this.validateForm = this.fb.group({
      cargoFinancionamiento: [0],
      ajuste: [0],
      cargoCorte: [0],
      recargo: [0],
      otros: [0],
      total: [0],
    });
    this.listOfDataFacturas = [];
    this.listOfDisplayData = [];
    if (JSON.parse(localStorage.getItem('dataFG'))) {
      this.listOfDataFacturas = JSON.parse(localStorage.getItem('dataFG'));
      this.listOfDisplayData = [...this.listOfDataFacturas];
      console.log(this.listOfDisplayData);

      this.visibleEF = false;
      this.spinner.hide();
    }

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
        1,
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')} 00:00:00`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')} 00:00:00`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.listOfDataFacturas = data;
            this.listOfDisplayData = [...this.listOfDataFacturas];
            this.visibleEF = false;
            localStorage.setItem('dataFG', JSON.stringify(this.listOfDataFacturas));

            if (this.listOfDataFacturas.length <= 0) {
              swal({
                icon: 'error',
                title: 'No se encontraron facturas',
                text: 'Por favor revise la fecha que ha consultado'
              });
              this.spinner.hide();
            }
            this.spinner.hide();
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

  emitirFactura() {
    if (this.setOfCheckedId.size > 0) {
      this.setOfCheckedId.forEach(x => {

        this.facturaService.changeFactura(x, { estado: 2 })
          .toPromise()
          .then(
            () => {
              this.listOfDataFacturas = this.listOfDataFacturas.filter(y => y.id !== x);
              this.listOfDisplayData = [...this.listOfDataFacturas];

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
    swal({
      title: "¿Está seguro de borrar el registro?",
      // text: "Una vez eliminado el registro ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {

          this.facturaService.changeFactura(data.id, { estado: 0 })
            .toPromise()
            .then(
              () => {

                this.listOfDataFacturas = this.listOfDataFacturas.filter(x => x.id !== data.id);
                this.listOfDisplayData = [...this.listOfDataFacturas];

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

        } else {
          swal("Su registro sigue activo");
        }
      });

  }

  generarFacturas() {
    if (this.setOfCheckedIdM.size > 0) {
      console.log(this.setOfCheckedIdM);
      console.log(this.setOfCheckedId);


      // let medidores: any[] = [...this.setOfCheckedIdM];

      // this.facturaService.generarFactura(medidores)
      //   .toPromise()
      //   .then(
      //     () => {
      //       swal({
      //         icon: 'success',
      //         text: 'Las facturas se están generando'
      //       });

      //     },
      //     (error) => {
      //       swal({
      //         icon: 'error',
      //         text: 'No se pudo generar las facturas'
      //       });

      //       console.log(error);
      //     });

    } else {
      swal({
        icon: 'warning',
        text: 'No selecciono ningún medidor'
      });
    }
  }

  sort(op) {

    switch (op) {
      case 'cod': {
        let array = this.listOfDataFacturas.sort(function (a, b) {
          return a.codigo.localeCompare(b.codigo);
        });
        this.listOfDisplayData = [...array]
      }
        break;
      case 'con': {
        let array = this.listOfDataFacturas.sort(function (a, b) {
          return a.contrato.localeCompare(b.contrato);
        });
        this.listOfDisplayData = [...array]
      }
        break;
      case 'cli': {
        let array = this.listOfDataFacturas.sort(function (a, b) {
          return a.cliente.localeCompare(b.cliente);
        });
        this.listOfDisplayData = [...array]
      }
        break;
      case 'f': {
        let array = this.listOfDataFacturas.sort(function (a, b) {
          return new Date(b.fechaLectura).getTime() - new Date(a.fechaLectura).getTime();
        });
        this.listOfDisplayData = [...array];
      }
        break;
      default:
        break;
    }
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
            this.listOfDisplayData = [...this.listOfDataFacturas];

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

  updateCheckedSet(id: number, medidorId: number, checked: boolean): void {
    console.log(id, medidorId);

    if (checked) {
      this.setOfCheckedId.add(id);
      this.setOfCheckedIdM.add(medidorId);
    } else {
      this.setOfCheckedId.delete(id);
      this.setOfCheckedIdM.delete(medidorId);
    }
  }

  onItemChecked(id: number, medidorId: number, checked: boolean): void {
    this.updateCheckedSet(id, medidorId, checked);
    this.refreshCheckedStatus();
    console.log(id, medidorId);

  }

  onAllChecked(value: boolean): void {
    this.listOfCurrentPageData.forEach(item => this.updateCheckedSet(item.id, item.medidorId, value));
    this.refreshCheckedStatus();
  }

  onCurrentPageDataChange($event: any[]): void {
    this.listOfCurrentPageData = $event;
    this.refreshCheckedStatus();
  }

  refreshCheckedStatus(): void {
    this.checked = this.listOfCurrentPageData.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listOfCurrentPageData.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
    this.checkedM = this.listOfCurrentPageDataM.every(item => this.setOfCheckedIdM.has(item.medidorId));
    this.indeterminateM = this.listOfCurrentPageDataM.some(item => this.setOfCheckedIdM.has(item.medidorId)) && !this.checkedM;
  }

  // Opciones medidores
  updateCheckedSetMedidor(medidorId: number, checked: boolean): void {
    console.log(medidorId);

    if (checked) {
      this.setOfCheckedIdM.add(medidorId);
    } else {
      this.setOfCheckedIdM.delete(medidorId);
    }
  }

  onItemCheckedMedidor(medidorId: number, checked: boolean): void {
    this.updateCheckedSetMedidor(medidorId, checked);
    this.refreshCheckedStatusMedidor();
  }

  onAllCheckedMedidor(value: boolean): void {
    console.log(value);

    this.listOfCurrentPageDataM.forEach(item => this.updateCheckedSetMedidor(item.medidorId, value));
    this.refreshCheckedStatusMedidor();
  }

  onCurrentPageDataChangeMedidor($event: any[]): void {
    this.listOfCurrentPageDataM = $event;
    this.refreshCheckedStatusMedidor();
  }

  refreshCheckedStatusMedidor(): void {
    this.checkedM = this.listOfCurrentPageDataM.every(item => this.setOfCheckedIdM.has(item.medidorId));
    this.indeterminateM = this.listOfCurrentPageDataM.some(item => this.setOfCheckedIdM.has(item.medidorId)) && !this.checkedM;
  }

}
