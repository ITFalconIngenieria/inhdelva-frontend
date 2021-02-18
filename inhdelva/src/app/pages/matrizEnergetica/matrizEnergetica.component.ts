import { MatrizEnergeticaService } from './../../servicios/matrizEnergetica.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';
import { ActoresService } from '../../servicios/actores.service';

interface Matriz {
  id: number;
  actorId: number;
  actor: string;
  fechaInicio: any;
  fechaFinal: any;
  observacion: string;
  estado: boolean;
  total: number;
}

@Component({
  selector: 'app-matrizEnergetica',
  templateUrl: './matrizEnergetica.component.html',
  styleUrls: ['./matrizEnergetica.component.css']
})
export class MatrizEnergeticaComponent implements OnInit {
  open;
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleDistribucion = false;
  validateForm: FormGroup;
  validateFormMatriz: FormGroup;
  dateFormat = 'yyyy/MM/dd';

  accion;
  idMatriz;
  idDistribucion;
  proveedores: any[] = [];

  listOfDataMatriz: any[] = [];
  listOfDataDistribucion: any[] = [];
  listOfDataDistribucionFiltrado: any[] = [];
  listaOrigenes: any[] = [];
  total: number = 0;
  totalEditar: number = 0;
  dataMatrizEnergetica: any[] = [];

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private matrizService: MatrizEnergeticaService,
    private actoresService: ActoresService
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
      emisiones: `${this.validateForm.value.emisiones}`,
      estado: true
    };

    if (this.accion === 'editar') {
      this.matrizService.putDistribucion(this.idDistribucion, dataDistribucion)
        .toPromise()
        .then(
          (data: any) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataDistribucion.filter(x => x.id === this.idDistribucion)) {
              item.origenId = data.origenId;
              item.origen = { ...data.origen };
              item.matrizId = data.matrizId;
              item.matriz = { ...data.matriz };
              item.valor = data.valor;
              item.emisiones = data.emisiones;
              item.estado = data.estado;
            }

            for (const item of this.listOfDataDistribucionFiltrado.filter(x => x.id === this.idDistribucion)) {
              item.origenId = data.origenId;
              item.origen = { ...data.origen };
              item.matrizId = data.matrizId;
              item.matriz = { ...data.matriz };
              item.valor = data.valor;
              item.emisiones = data.emisiones;
              item.estado = data.estado;
            }

            this.total = 0;
            const arrayTest: any[] = this.listOfDataDistribucion.filter(t => t.matrizId === this.idMatriz);
            // tslint:disable-next-line: prefer-for-of
            for (let y = 0; y < arrayTest.length; y++) {
              this.total += Math.round(parseFloat(arrayTest[y].valor) * 100) / 100;
            }

            for (const item of this.dataMatrizEnergetica.filter(x => x.id === this.idMatriz)) {
              item.total = this.total;
            }
            this.total = 0;
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
            this.accion = 'new';
            this.limpiarDistribucion();
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
            this.listOfDataDistribucionFiltrado = [...this.listOfDataDistribucionFiltrado, data];

            this.total = 0;
            const arrayTest: any[] = this.listOfDataDistribucion.filter(t => t.matrizId === this.idMatriz);
            // tslint:disable-next-line: prefer-for-of
            for (let y = 0; y < arrayTest.length; y++) {
              this.total += Math.round(parseFloat(arrayTest[y].valor) * 100) / 100;
            }

            for (const item of this.dataMatrizEnergetica.filter(x => x.id === this.idMatriz)) {
              item.total = this.total;
            }
            this.total = 0;

            this.limpiarDistribucion();

          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.limpiarDistribucion();

          }
        );
    }
  }

  editarDistribucion(data) {
    this.idDistribucion = data.id;
    this.accion = 'editar';

    this.validateForm = this.fb.group({
      origenId: [data.origenId, [Validators.required]],
      valor: [data.valor],
      emisiones: [data.emisiones],
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
          this.listOfDataDistribucionFiltrado = this.listOfDataDistribucionFiltrado.filter(x => x.id !== data.id);

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

  onOpen(event) {
    this.open = event;
  }

  ////////////////////////////////////////////////////////
  guardarMatriz() {
    // tslint:disable-next-line: max-line-length
    this.validateFormMatriz.value.observacion = (this.validateFormMatriz.value.observacion === '' || this.validateFormMatriz.value.observacion === null) ? 'N/A' : this.validateFormMatriz.value.observacion;

    const fechaInicio = (this.open === undefined) ? moment(`${moment(this.validateFormMatriz.value.fechaInicio[0]).subtract(1, 'days').format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString() : moment(`${moment(this.validateFormMatriz.value.fechaInicio[0]).format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString()
    const fechaFinal = (this.open === undefined) ? moment(`${moment(this.validateFormMatriz.value.fechaInicio[1]).subtract(1, 'days').format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString() : moment(`${moment(this.validateFormMatriz.value.fechaInicio[1]).format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString()

    const dataMatriz = {
      fechaInicio: fechaInicio,
      fechaFinal: fechaFinal,
      actorId: this.validateFormMatriz.value.actorId,
      observacion: this.validateFormMatriz.value.observacion,
      estado: true
    };
    this.open = undefined;

    if (this.accion === 'editar') {
      this.matrizService.putMatriz(this.idMatriz, dataMatriz)
        .toPromise()
        .then(
          (data: any) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.dataMatrizEnergetica.filter(x => x.id === this.idMatriz)) {
              item.fechaInicio = data.fechaInicio;
              item.fechaFinal = data.fechaFinal;
              item.actorId = data.actorId;
              item.actor = data.actor.codigo;
              item.observacion = data.observacion;
              item.total = this.totalEditar;
            }

            this.limpiarMatrizEnergetica();
            this.accion = 'new';
            this.isVisible = false;
          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.limpiarMatrizEnergetica();
            this.accion = 'new';
            this.isVisible = false;
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
            this.dataMatrizEnergetica = [...this.dataMatrizEnergetica,
            {
              id: data.id,
              actorId: data.actorId,
              actor: data.actor.codigo,
              fechaInicio: data.fechaInicio,
              fechaFinal: data.fechaFinal,
              observacion: data.observacion,
              estado: data.estado,
              total: 0
            }];
            this.limpiarMatrizEnergetica();

          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.limpiarMatrizEnergetica();
          }
        );
    }
  }

  editarMatriz(data) {
    this.isVisible = true;
    this.idMatriz = data.id;
    this.accion = 'editar';
    this.totalEditar = data.total;

    this.validateFormMatriz = this.fb.group({
      fechaInicio: [[moment(data.fechaInicio).add(2, 'days').format('YYYY-MM-DD'), moment(data.fechaFinal).add(2, 'days').format('YYYY-MM-DD')], [Validators.required]],
      actorId: [data.actorId, [Validators.required]],
      observacion: [data.observacion]
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
          this.dataMatrizEnergetica = this.dataMatrizEnergetica.filter(x => x.id !== data.id);

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
      valor: [0],
      emisiones: [0]
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

    this.matrizService.getMatrizRelacion()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfDataMatriz = data[0];
          this.listOfDataDistribucion = data[1];

          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < this.listOfDataMatriz.length; x++) {
            const arrayTest: any[] = this.listOfDataDistribucion.filter(t => t.matrizId === this.listOfDataMatriz[x].id);
            // tslint:disable-next-line: prefer-for-of
            for (let y = 0; y < arrayTest.length; y++) {

              this.total += arrayTest[y].valor;
            }

            this.dataMatrizEnergetica = [{
              id: this.listOfDataMatriz[x].id,
              actorId: this.listOfDataMatriz[x].actorId,
              actor: this.listOfDataMatriz[x].actor.codigo,
              fechaInicio: this.listOfDataMatriz[x].fechaInicio,
              fechaFinal: this.listOfDataMatriz[x].fechaFinal,
              observacion: this.listOfDataMatriz[x].observacion,
              estado: this.listOfDataMatriz[x].estado,
              total: Math.round(this.total * 100) / 100
            }, ...this.dataMatrizEnergetica];
            this.total = 0;
          }
        }
      );

    this.actoresService.getProveedores()
      .toPromise()
      .then(
        (data: any[]) => this.proveedores = data
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
    console.log(data);

    this.isVisibleDistribucion = true;
    this.idMatriz = data.id;
    this.listOfDataDistribucionFiltrado = this.listOfDataDistribucion.filter(x => x.matrizId === this.idMatriz);

  }

  handleCancelRollover(): void {
    this.accion = 'new';
    this.isVisibleDistribucion = false;
  }

  handleOkRollover(): void {
    this.isVisibleDistribucion = false;
  }

}
