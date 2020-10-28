import { CargosEspecialesService } from './../../servicios/cargosEspeciales.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import swal from 'sweetalert';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import * as moment from 'moment';

interface CargosFijos {
  id: number;
  fechaInicial: any;
  fechaFinal: any;
  financiamiento: number;
  rectificacion: number;
  corte: number;
  mora: number;
  otros: number;
  total: number;
  observacion: string;
}

@Component({
  selector: 'app-cargosEspeciales',
  templateUrl: './cargosEspeciales.component.html',
  styleUrls: ['./cargosEspeciales.component.css']
})
export class CargosEspecialesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private cargoService: CargosEspecialesService,
    private notification: NzNotificationService

  ) { }
  expandSet = new Set<number>();
  isVisible = false;
  validateForm: FormGroup;
  demoValue = 100;
  radioValue = 'A';
  dateFormat = 'yyyy/MM/dd';
  accion;
  cargoEdit;
  listOfData: any[] = [];
  dataProcesada: any[] = [];

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  guardar() {
    // tslint:disable-next-line: max-line-length
    this.validateForm.value.observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;

    const dataCargo = {
      fechaInicial: moment(this.validateForm.value.fechaInicial[0]).toISOString(),
      fechaFinal: moment(this.validateForm.value.fechaInicial[1]).toISOString(),
      financiamiento: `${this.validateForm.value.financiamiento}`,
      rectificacion: `${this.validateForm.value.rectificacion}`,
      corte: this.validateForm.value.corte,
      mora: `${this.validateForm.value.mora}`,
      otros: `${this.validateForm.value.otros}`,
      observacion: this.validateForm.value.observacion,
      estado: true
    };

    if (this.accion === 'editar') {
      this.cargoService.putCargoEspecial(this.cargoEdit, dataCargo)
        .toPromise()
        .then(
          () => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            const total = dataCargo.financiamiento + dataCargo.rectificacion + dataCargo.corte + dataCargo.mora + dataCargo.otros;
            for (const item of this.listOfData.filter(x => x.id === this.cargoEdit)) {
              item.fechaInicial = dataCargo.fechaInicial;
              item.fechaFinal = dataCargo.fechaFinal;
              item.financiamiento = dataCargo.financiamiento;
              item.rectificacion = dataCargo.rectificacion;
              item.corte = dataCargo.corte;
              item.mora = dataCargo.mora;
              item.otros = dataCargo.otros;
              item.total = total;
              item.observacion = dataCargo.observacion;
              item.estado = dataCargo.estado;
            }

            this.accion = 'new';

            this.limpiar();
          },
          (error) => {

            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
          }
        );
    } else {
      this.cargoService.postCargoEspecial(dataCargo)
        .toPromise()
        .then(
          (data: any) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            const total = data.financiamiento + data.rectificacion + data.corte + data.mora + data.otros;
            const cargo: CargosFijos = {
              id: data.id,
              fechaInicial: data.fechaInicial,
              fechaFinal: data.fechaFinal,
              financiamiento: data.financiamiento,
              rectificacion: data.rectificacion,
              corte: data.corte,
              mora: data.mora,
              otros: data.otros,
              total,
              observacion: data.observacion
            };

            this.listOfData = [...this.listOfData, cargo];
            this.limpiar();
          },
          (error) => {

            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
          }
        );
    }

  }

  editar(data) {
    this.accion = 'editar';
    this.isVisible = true;

    this.cargoEdit = data.id;
    this.validateForm = this.fb.group({
      fechaInicial: [[data.fechaInicial, data.fechaFinal], [Validators.required]],
      financiamiento: [data.financiamiento],
      rectificacion: [data.rectificacion],
      corte: [data.corte],
      mora: [data.mora],
      otros: [data.otros],
      observacion: [data.observacion]
    });

  }

  eliminar(data) {
    this.cargoService.deleteCargoEspecial(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfData = this.listOfData.filter(x => x.id !== data.id);
        },
        (error) => {

          this.ShowNotification(
            'error',
            'No se pudo eliminar',
            'El registro no pudo ser eleminado, por favor revise su conexión a internet o comuníquese con el proveedor.'
          );
          console.log(error);
        }
      );
  }

  limpiar() {
    this.validateForm = this.fb.group({
      fechaInicial: [null, [Validators.required]],
      financiamiento: [0],
      rectificacion: [0],
      corte: [0],
      mora: [0],
      otros: [0],
      observacion: [null]
    });
  }

  ngOnInit() {
    this.accion = 'new';
    this.cargoService.getCargosEspeciales()
      .toPromise()
      .then(
        (data: any[]) => {

          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < data.length; x++) {
            // tslint:disable-next-line: max-line-length
            const total = data[x].financiamiento + data[x].rectificacion + data[x].corte + data[x].mora + data[x].otros;
            const datos: CargosFijos = {
              id: data[x].id,
              fechaInicial: data[x].fechaInicial,
              fechaFinal: data[x].fechaFinal,
              financiamiento: data[x].financiamiento,
              rectificacion: data[x].rectificacion,
              corte: data[x].corte,
              mora: data[x].mora,
              otros: data[x].otros,
              total,
              observacion: data[x].observacion
            };

            this.dataProcesada.push(datos);
          }
          this.listOfData = this.dataProcesada;
          console.log(this.listOfData);
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

    this.limpiar();
  }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.limpiar();
  }

  handleOk(): void {
    this.isVisible = false;
  }

}
