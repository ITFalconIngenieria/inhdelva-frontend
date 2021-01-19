import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedidoresService } from '../../servicios/medidores.service';
import { MedidorPME, RolloverModel, Medidor } from '../../Modelos/medidor';
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
  isVisibleMV = false;
  validateForm: FormGroup;
  validateFormMedidorV: FormGroup;
  disabledLec: boolean;
  codigo: string;
  descripcion: string;
  serie: string;
  modelo: string;
  direccionIp: string;
  lecMax: any;
  conexion: any;
  multiplicador: number;
  observacion: string;
  tipoMedidor: string = 'f'
  disableVirtual: boolean = false;
  idMVForm;
  codigoMedidor;
  codMV;
  accion;
  idMedidor;
  idMV;
  idRollover;
  cantidad;
  accionMV;
  idMVEdit;
  disebleTipo: boolean = false;
  cantMV: number = 0;
  medidoresPME: any[] = [];
  listOfDataMedidores: MedidorPME[] = [];
  listOfDataRollover: RolloverModel[] = [];
  listOfDataRolloverMedidor: RolloverModel[] = [];

  listOfDataMVirtuales: any[] = [];
  MVirtualesJoin: any[] = [];
  MVirtualesFilter: any[] = [];

  constructor(
    private fb: FormBuilder,
    private medidoresService: MedidoresService,
    private notification: NzNotificationService
  ) { }

  parserLectura = (value: string) => value.replace('kW ', '');
  formatterLectura = (value: number) => `${value} kW`;

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
    // tslint:disable-next-line: max-line-length
    const observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;
    // this.validateForm.value.fecha = moment(this.validateForm.value.fecha).format('YYYY-MM-DD HH:mm:ss')
    const dataRollover = {
      medidorId: this.idMedidor,
      fecha: moment(this.validateForm.value.fecha).toISOString(),
      energia: (this.validateForm.value.energia === 'false') ? false : true,
      lecturaAnterior: `${this.validateForm.value.lecturaAnterior}`,
      lecturaNueva: `${this.validateForm.value.lecturaNueva}`,
      observacion,
      estado: true
    };

    console.log(dataRollover);


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
            for (const item of this.listOfDataRollover.filter(x => x.id === this.idRollover)) {
              item.medidorId = dataRollover.medidorId;
              item.fecha = dataRollover.fecha;
              item.energia = dataRollover.energia;
              item.lecturaAnterior = dataRollover.lecturaAnterior;
              item.lecturaNueva = dataRollover.lecturaNueva;
              item.observacion = dataRollover.observacion;
              item.estado = dataRollover.estado;
            }

            this.accion = 'new';
            this.limpiarRollover();

          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            this.accion = 'new';
            this.limpiarRollover();
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
            this.listOfDataRollover = [...this.listOfDataRollover, data];
            this.limpiarRollover();

          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            this.limpiarRollover();
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
          this.listOfDataRollover = this.listOfDataRollover.filter(x => x.id !== data.id);

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
      lecturaMax: `${this.lecMax}`,
      multiplicador: this.multiplicador,
      puntoMedicionId: this.conexion,
      tipo: (this.tipoMedidor === 'f') ? false : true,
      observacion: (this.observacion === '' || this.observacion === null) ? 'N/A' : this.observacion,
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
              item.puntoMedicionId = dataMedidor.puntoMedicionId;
              item.observacion = dataMedidor.observacion;
            }

            this.codigo = '';
            this.descripcion = '';
            this.serie = '';
            this.modelo = '';
            this.direccionIp = '';
            this.lecMax = 0;
            this.conexion = 1;
            this.multiplicador = 0;
            this.observacion = '';

            this.accion = 'new';
          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);

            this.codigo = '';
            this.descripcion = '';
            this.serie = '';
            this.modelo = '';
            this.direccionIp = '';
            this.lecMax = 0;
            this.conexion = 1;
            this.multiplicador = 0;
            this.observacion = '';

            this.accion = 'new';
          }
        );
    } else {

      this.medidoresService.postMedidores(dataMedidor)
        .toPromise()
        .then(
          (data: Medidor) => {
            this.cantidad = this.cantidad + 1;
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            // this.listOfDataMedidores = [...this.listOfDataRolloverMedidor, data];

            this.codigo = '';
            this.descripcion = '';
            this.serie = '';
            this.modelo = '';
            this.direccionIp = '';
            this.lecMax = 0;
            this.conexion = 1;
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

            this.codigo = '';
            this.descripcion = '';
            this.serie = '';
            this.modelo = '';
            this.direccionIp = '';
            this.lecMax = 0;
            this.conexion = 1;
            this.multiplicador = 0;
            this.observacion = '';
          }
        );
    }
  }

  editarMedidor(data, tipo) {

    if (tipo === 'f') {
      this.disabledLec = false;
      this.isVisible = true;
      this.idMedidor = data.id;
      this.accion = 'editar';

      this.codigo = data.codigo;
      this.descripcion = data.descripcion;
      this.serie = data.serie;
      this.modelo = data.modelo;
      this.direccionIp = data.ip;
      this.lecMax = data.lecturaMax;
      this.tipoMedidor = (data.tipo === true) ? 'v' : 'f';
      this.conexion = (data.puntoMedicionId === 1) ? '1' : '2';
      this.multiplicador = data.multiplicador;
      this.observacion = data.observacion;
    } else {

      let info = data;
      console.log(info);

      this.checkMVirtual(data.id).then(
        (data) => {
          console.log(data);
          if (data === true) {
            this.accion = 'editar';
            this.isVisible = true;
            this.disebleTipo = true;
            this.idMedidor = info.id;
            this.codigo = info.codigo;
          } else {
            swal({
              icon: 'error',
              text: 'Este medidor no puede ser editado'
            });
          }
        }

      );

    }



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

  guardarMVirtual() {

    const dataMV = {
      medidorId: this.idMV,
      medidorVirtualId: this.idMVForm,
      operacion: (this.validateFormMedidorV.value.operacion === 'true') ? true : false,
      observacion: this.validateFormMedidorV.value.observacion
    };

    if (this.accionMV === 'editar') {


    } else {
      this.medidoresService.postMedidoreVirtual(dataMV)
        .toPromise()
        .then(
          (data) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.limpiarMVirtual();
            console.log(data);
          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);

            this.limpiarMVirtual();
          }
        )
    }
  }

  editarMVirtual(data) {


  }

  eliminarMVirtual(data) {
    let info = data;

    this.checkMVirtual(data.id).then(
      (data) => {
        console.log(data);
        if (data === true) {

          this.medidoresService.deleteMedidoreVirtual(info.id)
            .toPromise()
            .then(
              () => {
                this.ShowNotification(
                  'success',
                  'Eliminado',
                  'El registro fue eliminado con éxito'
                );
                this.listOfDataMVirtuales = this.listOfDataMVirtuales.filter(x => x.id !== info.id)
              },
              (error) => {
                this.ShowNotification(
                  'error',
                  'No se pudo eliminar',
                  'El registro no pudo ser eleminado, por favor revise su conexión a internet o comuníquese con el proveedor.'
                );
                console.log(error);
              }
            )
        } else {
          swal({
            icon: 'error',
            text: 'Este medidor no puede ser eliminado'
          });
        }
      }

    );

  }

  checkMVirtual(id) {

    return this.medidoresService.checkMedidor(id)
      .toPromise()
      .then(
        (data) => {

          let permiso = data[0].Permiso;
          return permiso;
        }
      )
  }
  busquedadMedidor() {
    const codigo = this.codigo;
    const medidor: MedidorPME[] = this.medidoresPME.filter(x => x.codigo === codigo);

    swal({
      icon: 'success',
      text: 'Medidor encontrado'
    });

    if (medidor.length > 0) {
      this.descripcion = medidor[0].descripcion;
      this.serie = medidor[0].serie;
      this.modelo = medidor[0].modelo;
      this.direccionIp = medidor[0].ip;
      this.conexion = medidor[0].puntoMedicionId;
      this.lecMax = medidor[0].lecturaMax;
      this.observacion = medidor[0].observacion;
      this.idMVForm = medidor[0].id;

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

  limpiarRollover() {
    this.validateForm = this.fb.group({
      fecha: [null, [Validators.required]],
      energia: ['false', [Validators.required]],
      lecturaAnterior: [0, [Validators.required]],
      lecturaNueva: [0, [Validators.required]],
      observacion: ['']
    });
  }

  limpiarMVirtual() {
    this.validateFormMedidorV = this.fb.group({
      operacion: [0],
      observacion: ['']
    });
  }

  ngOnInit() {
    this.accion = 'nuevo';
    this.disabledLec = true;
    this.conexion = 1;
    this.medidoresService.getMedidoresPME()
      .toPromise()
      .then(
        (data: MedidorPME[]) => {

          this.listOfDataMedidores = data;
          console.log(this.listOfDataMedidores);

          this.cantidad = data.length;

          this.medidoresService.getMedidoreVirtuales()
            .toPromise()
            .then((data: any[]) => {
              console.log(this.listOfDataMVirtuales);

              this.listOfDataMVirtuales = data
            })

          this.medidoresService.getMedidoreVirtualesJoin()
            .toPromise()
            .then(
              (data: any) => {
                console.log(data);

                this.MVirtualesJoin = data;
                this.cantMV = this.listOfDataMVirtuales.length;

              }
            )



          ///////
          // Clientes.E_31_3
          // MV.14.1

          // for (let x = 0; x < data.length; x++) {
          //   this.listOfDataMedidores = [{
          //     id: data[x].id,
          //     codigo: data[x].codigo.substr(9),
          //     descripcion: data[x].descripcion,
          //     serie: data[x].serie,
          //     modelo: data[x].modelo,
          //     ip: data[x].ip,
          //     lecturaMax: data[x].lecturaMax,
          //     puntoMedicionId: data[x].puntoMedicionId,
          //     multiplicador: data[x].multiplicador,
          //     observacion: data[x].observacion,
          //     contrato: (data[x].contrato)
          //   }, ...this.listOfDataMedidores];
          // }
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
        (data: any[]) => {
          this.medidoresPME = data;
          // tslint:disable-next-line: prefer-for-of
          // for (let x = 0; x < data.length; x++) {
          //   this.medidoresPME = [{
          //     id: data[x].id,
          //     codigo: data[x].codigo.substr(9),
          //     descripcion: data[x].descripcion,
          //     serie: data[x].serie,
          //     modelo: data[x].modelo,
          //     ip: data[x].ip,
          //     lecturaMax: data[x].lecturaMax,
          //     puntoMedicionId: data[0].puntoMedicionId,
          //     multiplicador: data[x].multiplicador,
          //     observacion: data[x].observacion,
          //     contrato: (data[x].contrato)
          //   }, ...this.medidoresPME];
          // }

        }
      );

    this.limpiarRollover();
    this.limpiarMVirtual();
  }

  changeTipo(data) {
    this.disableVirtual = (data === 'v') ? true : false;
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.accion = 'new';
    this.isVisible = false;
    this.codigo = '';
    this.descripcion = '';
    this.serie = '';
    this.modelo = '';
    this.direccionIp = '';
    this.lecMax = 0;
    this.conexion = 0;
    this.multiplicador = 0;
    this.observacion = '';
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
    this.accion = 'new';
    this.isVisibleRollover = false;
    this.limpiarRollover();
  }

  handleOkRollover(): void {
    this.isVisibleRollover = false;
  }

  showModalMV(data): void {

    this.isVisibleMV = true;
    this.idMV = data.id;
    this.codMV = data.codigo;
    this.MVirtualesFilter = this.MVirtualesJoin.filter(x => x.medidorId === data.id)

  }

  handleCancelMV(): void {
    this.accion = 'new';
    this.isVisibleMV = false;
    this.limpiarMVirtual();
  }

  handleOkMV(): void {
    this.isVisibleMV = false;
  }

}