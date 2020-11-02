import { MatrizEnergeticaService } from './../../servicios/matrizEnergetica.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';

@Component({
  selector: 'app-matrizEnergetica',
  templateUrl: './matrizEnergetica.component.html',
  styleUrls: ['./matrizEnergetica.component.css']
})
export class MatrizEnergeticaComponent implements OnInit {
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleDistribucion = false;
  validateForm: FormGroup;
  validateFormMatriz: FormGroup;
  dateFormat = 'yyyy/MM/dd';


  codigoMedidor;

  accion;
  idMatriz;
  idDistribucion;
  proveedores: any[] = [];

  medidoresPME: any[] = [];
  listOfDataMatriz: any[] = [];
  listOfDataDistribucion: any[] = [];
  listOfDataRolloverMedidor: any[] = [];
  listaOrigenes: any[] = [];

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private matrizService: MatrizEnergeticaService
  ) { }

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

    // tslint:disable-next-line: forin
    for (const i in this.validateFormMatriz.controls) {
      this.validateFormMatriz.controls[i].markAsDirty();
      this.validateFormMatriz.controls[i].updateValueAndValidity();
    }
  }

  guardarDistribucion() {

    const dataDistribucion = {
      origenId: this.validateForm.value.origenId,
      matrizId: this.idMatriz,
      valor: `${this.validateForm.value.valor}`,
      estado: true
    };

    if (this.accion === 'editar') {
      this.matrizService.putDistribucion(this.idDistribucion, dataDistribucion)
        .toPromise()
        .then(
          () => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataDistribucion.filter(x => x.id === this.idDistribucion)) {
              item.origenId = dataDistribucion.origenId;
              item.matrizId = dataDistribucion.matrizId;
              item.valor = dataDistribucion.valor;
              item.estado = dataDistribucion.estado;
            }
            this.accion = 'new';
            this.limpiarDistribucion();

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
      this.matrizService.postDistribucion(dataDistribucion)
        .toPromise()
        .then(
          (data: any) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataDistribucion = [...this.listOfDataDistribucion, data];
            ////////
            this.limpiarDistribucion();

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

  editarDistribucion(data) {
    this.idDistribucion = data.id;
    this.accion = 'editar';

    this.validateForm = this.fb.group({
      origenId: [data.origenId, [Validators.required]],
      valor: [data.valor, [Validators.required]],
    });
  }

  eliminarDistribucion(data) {
    this.matrizService.deleteDistribucion(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfDataDistribucion = this.listOfDataDistribucion.filter(x => x.id !== data.id);
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

  ////////////////////////////////////////////////////////
  guardarMatriz() {
    // tslint:disable-next-line: max-line-length
    this.validateFormMatriz.value.observacion = (this.validateFormMatriz.value.observacion === '' || this.validateFormMatriz.value.observacion === null) ? 'N/A' : this.validateFormMatriz.value.observacion;

    const dataMatriz = {
      fechaInicio: this.validateFormMatriz.value.fechaInicio[0],
      fechaFinal: this.validateFormMatriz.value.fechaInicio[1],
      actorId: this.validateFormMatriz.value.actorId,
      observacion: this.validateFormMatriz.value.observacion,
      estado: true
    };

    if (this.accion === 'editar') {
      this.matrizService.putMatriz(this.idMatriz, dataMatriz)
        .toPromise()
        .then(
          () => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataMatriz.filter(x => x.id === this.idMatriz)) {
              item.fechaInicio = dataMatriz.fechaInicio;
              item.fechaFinal = dataMatriz.fechaFinal;
              item.actorId = dataMatriz.actorId;
              item.observacion = dataMatriz.observacion;
            }

            this.limpiarMatrizEnergetica();

            this.accion = 'new';
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
      this.matrizService.postMatriz(dataMatriz)
        .toPromise()
        .then(
          (data: any) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataMatriz = [...this.listOfDataMatriz, data];

            this.limpiarMatrizEnergetica();

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

  editarMatriz(data) {
    this.isVisible = true;
    this.idMatriz = data.id;
    this.accion = 'editar';

    this.validateFormMatriz = this.fb.group({
      fechaInicio: [[data.fechaInicio, data.fechaFinal], [Validators.required]],
      actorId: [data.actorId, [Validators.required]],
      observacion: ['']
    });

  }

  eliminarMatriz(data) {
    this.matrizService.deleteMatriz(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfDataMatriz = this.listOfDataMatriz.filter(x => x.id !== data.id);
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

  limpiarMatrizEnergetica() {
    this.validateFormMatriz = this.fb.group({
      fechaInicio: [null, [Validators.required]],
      actorId: [null, [Validators.required]],
      observacion: ['']
    });

  }

  limpiarDistribucion() {
    this.validateForm = this.fb.group({
      origenId: [null, [Validators.required]],
      valor: [0, [Validators.required]],
    });
  }

  ngOnInit() {
    this.accion = 'new';
    this.limpiarMatrizEnergetica();
    this.limpiarDistribucion();

    this.matrizService.getOrigenes()
      .toPromise()
      .then(
        (data: any[]) => this.listaOrigenes = data
      );

    this.matrizService.getMatriz()
      .toPromise()
      .then(
        (data: any[]) => this.listOfDataMatriz = data
      );

    this.matrizService.getDistribucion()
      .toPromise()
      .then(
        (data: any[]) => this.listOfDataDistribucion = data
      );

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
    this.accion = 'new';
    this.isVisible = false;

    this.limpiarMatrizEnergetica();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  showModalDistribucion(data): void {
    this.isVisibleDistribucion = true;
    this.idMatriz = data.id;
    //  this.listOfDataRolloverMedidor = this.listOfDataDistribucion.filter(x => x.matrizId === this.idMatriz);

  }

  handleCancelRollover(): void {
    this.accion = 'new';
    this.isVisibleDistribucion = false;
  }

  handleOkRollover(): void {
    this.isVisibleDistribucion = false;
  }

}
