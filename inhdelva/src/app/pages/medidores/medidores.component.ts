import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedidoresService } from '../../servicios/medidores.service';
import { MedidorPME, RolloverModel } from '../../Modelos/medidor';
import * as moment from 'moment';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.component.html',
  styleUrls: ['./medidores.component.css']
})
export class MedidoresComponent implements OnInit {
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleRollover = false;
  validateForm: FormGroup;
  dateFormat = 'yyyy/MM/dd';

  codigo: string;
  descripcion: string;
  serie: string;
  modelo: string;
  direccionIp: string;
  lecMax: number;
  multiplicador: number;
  observacion: string;

  codigoMedidor;

  accion;
  idMedidor;
  idRollover;
  medidoresPME: any[] = [];
  listOfDataMedidores: MedidorPME[] = [];
  listOfDataRollover: RolloverModel[] = [];
  listOfDataRolloverMedidor: RolloverModel[] = [];

  constructor(
    private fb: FormBuilder,
    private medidoresService: MedidoresService,
    private notification: NzNotificationService
  ) { }

  parserLectura = (value: string) => value.replace('kW ', '');
  formatterLectura = (value: number) => `kW ${value}`;

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

  guardarRollover() {
    const dataRollover = {
      medidorId: this.idMedidor,
      fecha: moment(this.validateForm.controls.fecha.value).toISOString(),
      energia: (this.validateForm.controls.energia.value === 'false') ? false : true,
      lecturaAnterior: this.validateForm.controls.lecturaAnterior.value,
      lecturaNueva: this.validateForm.controls.lecturaNueva.value,
      observacion: this.validateForm.controls.observacion.value,
      estado: true
    };

    if (this.accion === 'editar') {
      this.medidoresService.putRollovers(this.idRollover, dataRollover)
        .toPromise()
        .then(
          () => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataRolloverMedidor.filter(x => x.id === this.idRollover)) {
              item.medidorId = dataRollover.medidorId;
              item.fecha = dataRollover.fecha;
              item.energia = dataRollover.energia;
              item.lecturaAnterior = dataRollover.lecturaAnterior;
              item.lecturaNueva = dataRollover.lecturaNueva;
              item.observacion = dataRollover.observacion;
              item.estado = dataRollover.estado;
            }

            this.validateForm = this.fb.group({
              fecha: [null, [Validators.required]],
              energia: [null, [Validators.required]],
              lecturaAnterior: [0, [Validators.required]],
              lecturaNueva: [0, [Validators.required]],
              observacion: [null]
            });

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
      this.medidoresService.postRollovers(dataRollover)
        .toPromise()
        .then(
          (data: RolloverModel) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataRolloverMedidor = [...this.listOfDataRolloverMedidor, data];
            this.validateForm = this.fb.group({
              fecha: [null, [Validators.required]],
              energia: [null, [Validators.required]],
              lecturaAnterior: [0, [Validators.required]],
              lecturaNueva: [0, [Validators.required]],
              observacion: [null]
            });

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
    this.medidoresService.deleteRollovers(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfDataRolloverMedidor = this.listOfDataRolloverMedidor.filter(x => x.id !== data.id);
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
  guardarMedidor() {
    const dataMedidor = {
      codigo: this.codigo,
      lecturaMax: this.lecMax,
      multiplicador: this.multiplicador,
      observacion: this.observacion,
      estado: true
    };

    if (this.accion === 'editar') {
      this.medidoresService.putMedidores(this.idMedidor, dataMedidor)
        .toPromise()
        .then(
          () => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataMedidores.filter(x => x.id === this.idMedidor)) {
              item.codigo = dataMedidor.codigo;
              item.lecturaMax = dataMedidor.lecturaMax;
              item.multiplicador = dataMedidor.multiplicador;
              item.observacion = dataMedidor.observacion;
            }

            this.codigo = '';
            this.descripcion = '';
            this.serie = '';
            this.modelo = '';
            this.direccionIp = '';
            this.lecMax = 0;
            this.multiplicador = 0;
            this.observacion = '';
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
      this.medidoresService.postMedidores(dataMedidor)
        .toPromise()
        .then(
          (data: RolloverModel) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataRolloverMedidor = [...this.listOfDataRolloverMedidor, data];

            this.codigo = '';
            this.descripcion = '';
            this.serie = '';
            this.modelo = '';
            this.direccionIp = '';
            this.lecMax = 0;
            this.multiplicador = 0;
            this.observacion = '';

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

  editarMedidor(data) {
    this.idMedidor = data.id;
    this.accion = 'editar';

    this.codigo = data.codigo;
    this.descripcion = data.descripcion;
    this.serie = data.serie;
    this.modelo = data.modelo;
    this.direccionIp = data.ip;
    this.lecMax = data.lecturaMax;
    this.multiplicador = data.multiplicador;
    this.observacion = data.observacion;
  }

  eliminarMedidor(data) {
    this.medidoresService.deleteMedidores(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfDataMedidores = this.listOfDataMedidores.filter(x => x.id !== data.id);
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

  busquedadMedidor() {
    const codigo = this.codigo;
    const medidor: MedidorPME[] = this.medidoresPME.filter(x => x.codigo === codigo);

    if (medidor.length > 0) {
      this.descripcion = medidor[0].descripcion;
      this.serie = medidor[0].serie;
      this.modelo = medidor[0].modelo;
      this.direccionIp = medidor[0].ip;
      this.lecMax = medidor[0].lecturaMax;
      this.observacion = medidor[0].observacion;

    } else {
      this.codigo = '';
      swal({
        icon: 'warning',
        text: 'No se encontró ese medidor'
      });
    }

  }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }

  ngOnInit() {
    this.accion = 'nuevo';

    this.medidoresService.getMedidoresPME()
      .toPromise()
      .then(
        (data: MedidorPME[]) => {
          this.listOfDataMedidores = data;
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

    this.medidoresService.getRollovers()
      .toPromise()
      .then(
        (data: RolloverModel[]) => {
          this.listOfDataRollover = data;
        }
      );

    this.medidoresService.busquedadMedidor()
      .toPromise()
      .then(
        (data: any[]) => this.medidoresPME = data
      );

    this.validateForm = this.fb.group({
      fecha: [null, [Validators.required]],
      energia: [null, [Validators.required]],
      lecturaAnterior: [0, [Validators.required]],
      lecturaNueva: [0, [Validators.required]],
      observacion: [null]
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

  showModalRollover(data): void {
    this.isVisibleRollover = true;
    this.codigoMedidor = data.codigo;
    this.idMedidor = data.id;
    this.listOfDataRolloverMedidor = this.listOfDataRollover.filter(x => x.medidorId === this.idMedidor);

  }

  handleCancelRollover(): void {
    this.isVisibleRollover = false;
  }

  handleOkRollover(): void {
    this.isVisibleRollover = false;
  }

}
