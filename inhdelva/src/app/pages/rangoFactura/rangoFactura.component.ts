import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { RangoFechaService } from '../../servicios/rangoFecha.service';
import swal from 'sweetalert';
import * as moment from 'moment';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-rangoFactura',
  templateUrl: './rangoFactura.component.html',
  styleUrls: ['./rangoFactura.component.css']
})
export class RangoFacturaComponent implements OnInit {
  expandSet = new Set<any>();
  isVisible = false;
  validateForm: FormGroup;
  demoValue = 100;
  radioValue = 'A';
  rangoEdit;
  listOfDataRango: any[] = [];
  accion: string;
  time = new Date();

  constructor(
    private fb: FormBuilder,
    private rangoService: RangoFechaService,
    private notification: NzNotificationService
  ) { }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

  }

  guardar() {

    this.validateForm.value.HoraInicio = moment(this.validateForm.value.HoraInicio).toISOString();
    this.validateForm.value.HoraFinal = moment(this.validateForm.value.HoraFinal).toISOString();
    this.validateForm.value.Mes = (this.validateForm.value.Mes === 'false') ? false : true;

    const dataRango = {
      ...this.validateForm.value,
      Estado: true
    };

    if (this.accion === 'editar') {
      this.rangoService.putRango(this.rangoEdit, dataRango)
        .toPromise()
        .then(
          () => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            for (const item of this.listOfDataRango.filter(x => x.Id === this.rangoEdit)) {
              item.DiaInicio = dataRango.DiaInicio;
              item.DiaFinal = dataRango.DiaFinal;
              item.Mes = dataRango.Mes;
              item.HoraInicio = dataRango.HoraInicio;
              item.HoraFinal = dataRango.HoraFinal;
              item.Estado = dataRango.Estado;
            }

            this.limpiar();
            this.accion = 'new';
            this.isVisible = false;

          },
          (error) => {

            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            this.accion = 'new';
            this.isVisible = false;
            console.log(error);
          }
        );
    } else {
      this.rangoService.postRango(dataRango)
        .toPromise()
        .then(
          (data: any) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataRango = [...this.listOfDataRango, data];

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

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }

  limpiar() {
    this.validateForm = this.fb.group({
      Mes: [null, [Validators.required]],
      DiaInicio: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      DiaFinal: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      HoraInicio: [null, [Validators.required]],
      HoraFinal: [null, [Validators.required]],
    });
  }

  ngOnInit() {

    this.accion = 'nuevo';

    this.rangoService.getRangos()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfDataRango = data;
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

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.accion = 'new';
    this.isVisible = false;
    this.limpiar();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  editar(data) {
    this.accion = 'editar';
    this.isVisible = true;

    this.rangoEdit = data.Id;

    this.validateForm = this.fb.group({
      Mes: [(data.Mes === false) ? 'false' : 'true', [Validators.required]],
      DiaInicio: [data.DiaInicio, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      DiaFinal: [data.DiaFinal, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      HoraInicio: [new Date(data.HoraInicio), [Validators.required]],
      HoraFinal: [new Date(data.HoraFinal), [Validators.required]],
    });

  }

  eliminar(data) {
    this.rangoService.deleteRango(data.Id, { Estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfDataRango = this.listOfDataRango.filter(x => x.Id !== data.Id);
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

}
