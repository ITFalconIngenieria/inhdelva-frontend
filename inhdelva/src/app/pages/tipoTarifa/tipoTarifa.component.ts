import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatrizHoraria, ParametroTarifaModel, PuntoMedicion, TarifaModel, TipoCargo } from '../../Modelos/tarifa';
import { TarifaService } from '../../servicios/tarifa.service';
import * as moment from 'moment';
import * as momentTZ from 'moment-timezone';
momentTZ().tz('America/Tegucigalpa').format();

import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';

@Component({
  selector: 'app-tipoTarifa',
  templateUrl: './tipoTarifa.component.html',
  styleUrls: ['./tipoTarifa.component.css']
})
export class TipoTarifaComponent implements OnInit {

  open;
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleParametro = false;
  validateFormTarifa: FormGroup;
  validateFormParametro: FormGroup;
  dateFormat = 'dd-MM-yyyy';
  accion;
  idTarifa;
  idParametro;
  listOfDataTarifa: any[] = [];
  listOfDataParametros: any[] = [];
  listOfDataParametrosFiltrado: any[] = [];
  puntoMedicion: PuntoMedicion[] = [];
  matrizHoraria: MatrizHoraria[] = [];
  tipoCargo: TipoCargo[] = [];
  bloqueHorario: any[] = [];
  unidad;
  searchValue = '';
  visible = false;
  listOfDisplayData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private tarifaService: TarifaService,
    private notification: NzNotificationService
  ) { }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    // for (const i in this.validateFormTarifa.value) {
    //   this.validateFormTarifa.value[i].markAsDirty();
    //   this.validateFormTarifa.value[i].updateValueAndValidity();
    // }
  }


  submitFormParametro(): void {
    // tslint:disable-next-line: forin
    // for (const i in this.validateFormParametro.value) {
    //   this.validateFormParametro.value[i].markAsDirty();
    //   this.validateFormParametro.value[i].updateValueAndValidity();
    // }
  }

  changeCargo(data) {
    const cargo = this.tipoCargo.filter(x => x.id === data);
    this.unidad = cargo[0].unidad;
  }

  guardarTarifa() {
    const dataTarifa = {
      codigo: this.validateFormTarifa.value.codigo,
      puntoMedicionId: this.validateFormTarifa.value.puntoMedicionId,
      descripcion: this.validateFormTarifa.value.descripcion,
      tipo: (this.validateFormTarifa.value.tipo === 'false') ? false : true,
      matrizHorariaId: this.validateFormTarifa.value.matrizHorariaId,
      estado: true
    };

    if (this.accion === 'editar') {
      this.tarifaService.putTarifa(this.idTarifa, dataTarifa)
        .toPromise()
        .then(
          (data: any) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataTarifa.filter(x => x.id === this.idTarifa)) {
              item.codigo = data.codigo;
              item.puntoMedicionId = data.puntoMedicionId;
              item.puntoMedicion = { ...data.puntoMedicion }
              item.descripcion = data.descripcion;
              item.tipo = data.tipo;
              item.matrizHorariaId = data.matrizHorariaId;
              item.matrizHoraria = { ...data.matrizHoraria }
              item.estado = data.estado;
            }
            this.listOfDisplayData = [...this.listOfDataTarifa];

            this.accion = 'new';
            this.limpiarTarifa();
            this.isVisible = false;
          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.accion = 'new';
            this.limpiarTarifa();
            this.isVisible = false;

          }
        );
    } else {
      this.tarifaService.postTarifa(dataTarifa)
        .toPromise()
        .then(
          (data: any) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataTarifa = [...this.listOfDataTarifa, data];
            this.listOfDisplayData = [...this.listOfDataTarifa];

            this.limpiarTarifa();
          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.limpiarTarifa();
          }
        );
    }
  }

  editarTarifa(data) {
    this.idTarifa = data.id;
    this.accion = 'editar';
    this.isVisible = true;

    this.validateFormTarifa = this.fb.group({
      codigo: [data.codigo, [Validators.required]],
      puntoMedicionId: [data.puntoMedicion.id, [Validators.required]],
      descripcion: [data.descripcion, [Validators.required]],
      tipo: [(data.tipo === false) ? 'false' : 'true'],
      matrizHorariaId: [data.matrizHoraria.id, [Validators.required]],
      observacion: [data.observacion]
    });
  }

  eliminarTarifa(data) {
    swal({
      title: "¿Está seguro de borrar el registro?",
      // text: "Una vez eliminado el registro ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.tarifaService.deleteTarifa(data.id, { estado: false })
            .toPromise()
            .then(
              () => {

                this.ShowNotification(
                  'success',
                  'Eliminado',
                  'El registro fue eliminado con éxito'
                );
                this.listOfDataTarifa = this.listOfDataTarifa.filter(x => x.id !== data.id);
                this.listOfDisplayData = [...this.listOfDataTarifa];

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

        } else {
          swal("Su registro sigue activo");
        }
      });
  }

  onOpen(event) {
    this.open = event;
  }

  guardarParametro() {
    // tslint:disable-next-line: max-line-length
    const observacion = (this.validateFormParametro.value.observacion === '' || this.validateFormParametro.value.observacion === null) ? 'N/A' : this.validateFormParametro.value.observacion;
    console.log(moment(`${moment(this.validateFormParametro.value.fechaInicio[0]).format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString());
    const fechaInicio = (this.open === undefined) ? moment(`${moment(this.validateFormParametro.value.fechaInicio[0]).subtract(1, 'days').format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString() : moment(`${moment(this.validateFormParametro.value.fechaInicio[0]).format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString();
    const fechaFinal = (this.open === undefined) ? moment(`${moment(this.validateFormParametro.value.fechaInicio[1]).subtract(1, 'days').format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString() : moment(`${moment(this.validateFormParametro.value.fechaInicio[1]).format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString();

    const dataParametro = {
      tarifaId: this.idTarifa,
      tipoCargoId: this.validateFormParametro.value.tipoCargoId,
      bloqueHorarioId: this.validateFormParametro.value.bloqueHorarioId,
      fechaInicio: fechaInicio,
      fechaFinal: fechaFinal,
      valor: `${this.validateFormParametro.value.valor}`,
      observacion,
      estado: true
    };
    this.open = undefined;

    if (this.accion === 'editar') {
      this.tarifaService.putTarifaParametro(this.idParametro, dataParametro)
        .toPromise()
        .then(
          (data: any) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            for (const item of this.listOfDataParametrosFiltrado.filter(x => x.id === this.idParametro)) {
              item.tarifaId = data.tarifaId;
              item.tarifa = { ...data.tarifa }
              item.tipoCargoId = data.tipoCargoId;
              item.tipoCargo = { ...data.tipoCargo }
              item.bloqueHorarioId = data.bloqueHorarioId;
              item.bloqueHorario = { ...data.bloqueHorario }
              item.fechaInicio = data.fechaInicio;
              item.fechaFinal = data.fechaFinal;
              item.dias = moment(data.fechaFinal).diff(moment(), 'days')
              item.valor = data.valor;
              item.observacion = data.observacion;
              item.estado = data.estado;
            }
            for (const item of this.listOfDataParametros.filter(x => x.id === this.idParametro)) {
              item.tarifaId = data.tarifaId;
              item.tarifa = { ...data.tarifa }
              item.tipoCargoId = data.tipoCargoId;
              item.tipoCargo = { ...data.tipoCargo }
              item.bloqueHorarioId = data.bloqueHorarioId;
              item.bloqueHorario = { ...data.bloqueHorario }
              item.fechaInicio = data.fechaInicio;
              item.fechaFinal = data.fechaFinal;
              item.dias = moment(data.fechaFinal).diff(moment(), 'days')
              item.valor = data.valor;
              item.observacion = data.observacion;
              item.estado = data.estado;
            }
            this.accion = 'new';
            this.unidad = null;
            this.limpiarParametro();
          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.accion = 'new';
            this.limpiarParametro();

          }
        );
    } else {
      this.tarifaService.postTarifaParametro(dataParametro)
        .toPromise()
        .then(
          (data: any) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.unidad = null;

            this.listOfDataParametrosFiltrado = [...this.listOfDataParametrosFiltrado, { data, 'dias': moment(data.fechaFinal).diff(moment(), 'days') }];
            this.listOfDataParametros = [...this.listOfDataParametros, data];

            this.limpiarParametro();
          },
          (error) => {
            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.limpiarParametro();
          }
        );
    }
  }

  editarParametro(data) {
    this.idParametro = data.id;
    this.accion = 'editar';

    const cargo = this.tipoCargo.filter(x => x.id === data.tipoCargo.id);
    this.unidad = cargo[0].unidad;

    this.validateFormParametro = this.fb.group({
      tipoCargoId: [data.tipoCargo.id, [Validators.required]],
      bloqueHorarioId: [data.bloqueHorario.id],
      // fechaInicio: [[data.fechaInicio, data.fechaFinal]],
      fechaInicio: [[moment(data.fechaInicio).add(2, 'days').format('YYYY-MM-DD'), moment(data.fechaFinal).add(2, 'days').format('YYYY-MM-DD')]],
      valor: [data.valor],
      observacion: [data.observacion]
    });
  }

  eliminarParametro(data) {
    swal({
      title: "¿Está seguro de borrar el registro?",
      // text: "Una vez eliminado el registro ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
          this.tarifaService.deleteTarifaParametro(data.id, { estado: false })
            .toPromise()
            .then(
              () => {

                this.ShowNotification(
                  'success',
                  'Eliminado',
                  'El registro fue eliminado con éxito'
                );
                this.listOfDataParametrosFiltrado = this.listOfDataParametrosFiltrado.filter(x => x.id !== data.id);
                this.listOfDataParametros = this.listOfDataParametros.filter(x => x.id !== data.id);

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

        } else {
          swal("Su registro sigue activo");
        }
      });
  }

  limpiarTarifa() {
    this.validateFormTarifa = this.fb.group({
      codigo: [null, [Validators.required]],
      puntoMedicionId: [null, [Validators.required]],
      descripcion: [''],
      tipo: [null, [Validators.required]],
      matrizHorariaId: [null, [Validators.required]]
    });
  }

  limpiarParametro() {
    this.validateFormParametro = this.fb.group({
      tipoCargoId: [null, [Validators.required]],
      bloqueHorarioId: [null],
      fechaInicio: [null, [Validators.required]],
      valor: [0],
      observacion: ['']
    });

  }

  sort(op) {
    if (op === 'p') {
      let array = this.listOfDataParametrosFiltrado.sort(function (a, b) {
        return new Date(b.fechaFinal).getTime() - new Date(a.fechaFinal).getTime();
      });
      this.listOfDataParametrosFiltrado = [...array];
    } else {
      let array = this.listOfDataTarifa.sort(function (a, b) {
        return a.codigo.localeCompare(b.codigo);
      });
      this.listOfDisplayData = [...array];
    }
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDataTarifa.filter((item: any) => (item.codigo.indexOf(this.searchValue) !== -1));
  }

  ngOnInit() {

    this.limpiarTarifa();
    this.limpiarParametro();

    this.tarifaService.getTarifasRelacion()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfDataTarifa = data;
          this.listOfDisplayData = [...this.listOfDataTarifa];

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

    this.tarifaService.getTarifasParametroRelacion()
      .toPromise()
      .then(
        (data: any[]) => {
          data.forEach(element => {
            this.listOfDataParametros.push({ ...element, 'dias': moment(element.fechaFinal).diff(moment(), 'days') });
          });
        }
      );

    this.tarifaService.getPuntoMedicion()
      .toPromise()
      .then(
        (data: PuntoMedicion[]) => this.puntoMedicion = data
      );

    this.tarifaService.getMatrizHoraria()
      .toPromise()
      .then(
        (data: MatrizHoraria[]) => this.matrizHoraria = data
      );

    this.tarifaService.getTipoCargo()
      .toPromise()
      .then(
        (data: TipoCargo[]) => this.tipoCargo = data
      );

  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.accion = 'new';
    this.isVisible = false;
    this.limpiarTarifa();
  }

  handleOk(): void {
    this.isVisible = false;
    this.limpiarTarifa();
  }

  showModalParametro(data): void {
    console.log(data);

    this.isVisibleParametro = true;
    this.idTarifa = data.id;

    this.listOfDataParametrosFiltrado = this.listOfDataParametros.filter(x => x.tarifaId === data.id);

    this.tarifaService.getBloqueHorario(data.matrizHorariaId)
      .toPromise()
      .then(
        (res: []) => this.bloqueHorario = res
      );
  }

  handleCancelParametro(): void {
    this.accion = 'new';
    this.isVisibleParametro = false;
    this.limpiarParametro();
  }

  handleOkParametro(): void {
    this.isVisibleParametro = false;
    this.limpiarParametro();
  }

}
