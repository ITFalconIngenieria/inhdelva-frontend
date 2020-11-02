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
  idMedidor;
  idRollover;
  origenes: any[] = [];
  proveedores: any[] = [];

  medidoresPME: any[] = [];
  listOfDataMatriz: any[] = [];
  listOfDataDistribucion: any[] = [];
  listOfDataRolloverMedidor: any[] = [];

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

  guardarRollover() {
    // tslint:disable-next-line: max-line-length
    // const observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;

    // const dataRollover = {
    //   medidorId: this.idMedidor,
    //   fecha: moment(this.validateForm.value.fecha).toISOString(),
    //   energia: (this.validateForm.value.energia === 'false') ? false : true,
    //   lecturaAnterior: this.validateForm.value.lecturaAnterior,
    //   lecturaNueva: this.validateForm.value.lecturaNueva,
    //   observacion,
    //   estado: true
    // };

    // if (this.accion === 'editar') {
    //   this.matrizService.putRollovers(this.idRollover, dataRollover)
    //     .toPromise()
    //     .then(
    //       () => {
    //         this.ShowNotification(
    //           'success',
    //           'Guardado con éxito',
    //           'El registro fue guardado con éxito'
    //         );
    //         for (const item of this.listOfDataRolloverMedidor.filter(x => x.id === this.idRollover)) {
    //           item.medidorId = dataRollover.medidorId;
    //           item.fecha = dataRollover.fecha;
    //           item.energia = dataRollover.energia;
    //           item.lecturaAnterior = dataRollover.lecturaAnterior;
    //           item.lecturaNueva = dataRollover.lecturaNueva;
    //           item.observacion = dataRollover.observacion;
    //           item.estado = dataRollover.estado;
    //         }
    //         this.accion = 'new';
    //         this.limpiarRollover();

    //       },
    //       (error) => {
    //         this.ShowNotification(
    //           'error',
    //           'No se pudo guardar',
    //           'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
    //         );
    //         console.log(error);
    //       }
    //     );
    // } else {
    //   this.matrizService.postRollovers(dataRollover)
    //     .toPromise()
    //     .then(
    //       (data: RolloverModel) => {
    //         this.ShowNotification(
    //           'success',
    //           'Guardado con éxito',
    //           'El registro fue guardado con éxito'
    //         );
    //         this.listOfDataRolloverMedidor = [...this.listOfDataRolloverMedidor, data];
    //         this.limpiarRollover();

    //       },
    //       (error) => {
    //         this.ShowNotification(
    //           'error',
    //           'No se pudo guardar',
    //           'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
    //         );
    //         console.log(error);
    //       }
    //     );
    // }
  }

  editarRollover(data) {
    this.idRollover = data.id;
    this.accion = 'editar';
    this.validateForm = this.fb.group({
      fecha: [data.fecha],
      energia: [(data.energia === false) ? 'false' : 'true'],
      lecturaAnterior: [data.lecturaAnterior],
      lecturaNueva: [data.lecturaNueva],
      observacion: [data.observacion]
    });
  }

  eliminarRollover(data) {
    // this.matrizService.deleteRollovers(data.id, { estado: false })
    //   .toPromise()
    //   .then(
    //     () => {
    //       this.ShowNotification(
    //         'success',
    //         'Eliminado',
    //         'El registro fue eliminado con éxito'
    //       );
    //       this.listOfDataRolloverMedidor = this.listOfDataRolloverMedidor.filter(x => x.id !== data.id);
    //     },
    //     (error) => {
    //       this.ShowNotification(
    //         'error',
    //         'No se pudo eliminar',
    //         'El registro no pudo ser eleminado, por favor revise su conexión a internet o comuníquese con el proveedor.'
    //       );
    //       console.log(error);
    //     }
    //   // );
  }

  ////////////////////////////////////////////////////////
  guardarMatriz() {

    // tslint:disable-next-line: max-line-length
   // const observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;

    // const dataMedidor = {
    //   codigo: this.codigo,
    //   lecturaMax: this.lecMax,
    //   multiplicador: this.multiplicador,
    //   observacion: (this.observacion === '' || this.observacion === null) ? 'N/A' : this.observacion,
    //   estado: true
    // };

    // if (this.accion === 'editar') {
    //   this.matrizService.putMedidores(this.idMedidor, dataMedidor)
    //     .toPromise()
    //     .then(
    //       () => {

    //         this.ShowNotification(
    //           'success',
    //           'Guardado con éxito',
    //           'El registro fue guardado con éxito'
    //         );
    //         for (const item of this.listOfDataMatriz.filter(x => x.id === this.idMedidor)) {
    //           item.codigo = dataMedidor.codigo;
    //           item.lecturaMax = dataMedidor.lecturaMax;
    //           item.multiplicador = dataMedidor.multiplicador;
    //           item.observacion = dataMedidor.observacion;
    //         }

    //         this.codigo = '';
    //         this.descripcion = '';
    //         this.serie = '';
    //         this.modelo = '';
    //         this.direccionIp = '';
    //         this.lecMax = 0;
    //         this.multiplicador = 0;
    //         this.observacion = '';

    //         this.accion = 'new';
    //       },
    //       (error) => {
    //         this.ShowNotification(
    //           'error',
    //           'No se pudo guardar',
    //           'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
    //         );
    //         console.log(error);
    //       }
    //     );
    // } else {
    //   this.matrizService.postMedidores(dataMedidor)
    //     .toPromise()
    //     .then(
    //       (data: RolloverModel) => {
    //         this.cantidad = this.cantidad + 1;
    //         this.ShowNotification(
    //           'success',
    //           'Guardado con éxito',
    //           'El registro fue guardado con éxito'
    //         );
    //         this.listOfDataRolloverMedidor = [...this.listOfDataRolloverMedidor, data];

    //         this.codigo = '';
    //         this.descripcion = '';
    //         this.serie = '';
    //         this.modelo = '';
    //         this.direccionIp = '';
    //         this.lecMax = 0;
    //         this.multiplicador = 0;
    //         this.observacion = '';

    //       },
    //       (error) => {
    //         this.ShowNotification(
    //           'error',
    //           'No se pudo guardar',
    //           'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
    //         );
    //         console.log(error);
    //       }
    //     );
    // }
  }

  editarMedidor(data) {
    this.isVisible = true;
    this.idMedidor = data.id;
    this.accion = 'editar';

  }

  eliminarMedidor(data) {
    // this.matrizService.deleteMedidores(data.id, { estado: false })
    //   .toPromise()
    //   .then(
    //     () => {
    //       this.ShowNotification(
    //         'success',
    //         'Eliminado',
    //         'El registro fue eliminado con éxito'
    //       );
    //       this.listOfDataMatriz = this.listOfDataMatriz.filter(x => x.id !== data.id);
    //     },
    //     (error) => {
    //       this.ShowNotification(
    //         'error',
    //         'No se pudo eliminar',
    //         'El registro no pudo ser eleminado, por favor revise su conexión a internet o comuníquese con el proveedor.'
    //       );
    //       console.log(error);
    //     }
    //   );
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
  }

  handleOk(): void {
    this.isVisible = false;
  }

  showModalRollover(data): void {
    this.isVisibleDistribucion = true;
    this.codigoMedidor = data.codigo;
    this.idMedidor = data.id;
    this.listOfDataRolloverMedidor = this.listOfDataDistribucion.filter(x => x.medidorId === this.idMedidor);

  }

  handleCancelRollover(): void {
    this.accion = 'new';
    this.isVisibleDistribucion = false;
  }

  handleOkRollover(): void {
    this.isVisibleDistribucion = false;
  }

}
