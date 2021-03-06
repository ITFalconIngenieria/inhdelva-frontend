import { ParametroEntradaService } from './../../servicios/parametroEntrada.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parametro } from '../../Modelos/parametros';
import { TarifaService } from '../../servicios/tarifa.service';
import { TipoCargo } from '../../Modelos/tarifa';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';
import * as moment from 'moment';

@Component({
  selector: 'app-parametrosEntrada',
  templateUrl: './parametrosEntrada.component.html',
  styleUrls: ['./parametrosEntrada.component.css']
})
export class ParametrosEntradaComponent implements OnInit {
  open;
  expandSet = new Set<number>();
  isVisible = false;
  validateForm: FormGroup;
  dateFormat = 'dd-MM-yyyy';
  accion;
  idParametro;
  listOfDataParametro: any[] = [];
  tipoCargo: TipoCargo[] = [];
  unidad;
  searchValue = '';
  visible = false;
  listOfDisplayData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private parametroServce: ParametroEntradaService,
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

  onOpen(event) {
    this.open = event;
  }

  guardarParametro() {
    // tslint:disable-next-line: max-line-length
    const observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;
    const fechaInicio = (this.open === undefined) ? moment(`${moment(this.validateForm.value.fechaInicio[0]).subtract(1, 'days').format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString() : moment(`${moment(this.validateForm.value.fechaInicio[0]).format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString()
    const fechaFinal = (this.open === undefined) ? moment(`${moment(this.validateForm.value.fechaInicio[1]).subtract(1, 'days').format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString() : moment(`${moment(this.validateForm.value.fechaInicio[1]).format('YYYY-MM-DD')}T00:00:00.000Z`).toISOString()

    const dataParametro = {
      tipoCargoId: this.validateForm.value.tipoCargoId,
      fechaInicio: fechaInicio,
      fechaFinal: fechaFinal,
      valor: `${this.validateForm.value.valor}`,
      observacion,
      estado: true
    };

    this.open = undefined;

    if (this.accion === 'editar') {
      this.parametroServce.putParametro(this.idParametro, dataParametro)
        .toPromise()
        .then(
          (data: any) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataParametro.filter(x => x.id === this.idParametro)) {
              item.tipoCargoId = data.tipoCargoId;
              item.tipoCargo = { ...data.tipoCargo };
              item.fechaInicio = data.fechaInicio;
              item.fechaFinal = data.fechaFinal;
              item.dias = moment(data.fechaFinal).diff(moment(), 'days')
              item.valor = data.valor;
              item.observacion = data.observacion;
              item.estado = data.estado;
            }
            console.log(this.listOfDataParametro);
            
            this.listOfDisplayData = [...this.listOfDataParametro];

            this.accion = 'new';
            this.unidad = null;
            this.limpiarParametro();
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
            this.limpiarParametro();
            this.isVisible = false;
          }
        );
    } else {
      this.parametroServce.postParametro(dataParametro)
        .toPromise()
        .then(
          (data: any) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataParametro = [...this.listOfDataParametro, { data, 'dias': moment(data.fechaFinal).diff(moment(), 'days') }];
            this.listOfDisplayData = [...this.listOfDataParametro];

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
            this.limpiarParametro();
          }
        );
    }
  }

  editarParametro(data) {
    this.idParametro = data.id;
    this.accion = 'editar';
    this.isVisible = true;

    const cargo = this.tipoCargo.filter(x => x.id === data.tipoCargoId);
    this.unidad = cargo[0].unidad;

    this.validateForm = this.fb.group({
      tipoCargoId: [data.tipoCargoId, [Validators.required]],
      fechaInicio: [[moment(data.fechaInicio).add(2, 'days').format('YYYY-MM-DD'), moment(data.fechaFinal).add(2, 'days').format('YYYY-MM-DD')], [Validators.required]],
      valor: [data.valor, [Validators.required]],
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

          this.parametroServce.deleteParametro(data.id, { estado: false })
            .toPromise()
            .then(
              () => {
                this.ShowNotification(
                  'success',
                  'Eliminado',
                  'El registro fue eliminado con éxito'
                );
                this.listOfDataParametro = this.listOfDataParametro.filter(x => x.id !== data.id);
                this.listOfDisplayData = [...this.listOfDataParametro];

              },
              (error) => {
                this.ShowNotification(
                  'error',
                  'No se pudo eliminar',
                  'El registro no pudo ser eleminado, por favor revise su conexión a internet o comuníquese con el proveedor.'
                );
                console.log(error);
              });

        } else {
          swal("Su registro sigue activo");
        }
      });
  }

  limpiarParametro() {
    this.validateForm = this.fb.group({
      tipoCargoId: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      valor: [1, [Validators.required]],
      observacion: ['']
    });
  }

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDataParametro.filter((item: any) => (item.tipoCargo.codigo.indexOf(this.searchValue) !== -1));
  }

  sortParametro() {
    let array = this.listOfDataParametro.sort(function (a, b) {
      return new Date(b.fechaFinal).getTime() - new Date(a.fechaFinal).getTime();
    });
    this.listOfDataParametro = [...array];
  }

  ngOnInit() {

    this.parametroServce.getParametroRelacion()
      .toPromise()
      .then(
        (data: any[]) => {

          data.forEach(element => {
            this.listOfDataParametro.push({ ...element, 'dias': moment(element.fechaFinal).diff(moment(), 'days') });
          });
          this.listOfDisplayData = [...this.listOfDataParametro];

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

    this.tarifaService.getTipoCargo()
      .toPromise()
      .then(
        (data: TipoCargo[]) => this.tipoCargo = data
      );

    this.limpiarParametro();
  }

  changeCargo(data) {
    const cargo = this.tipoCargo.filter(x => x.id === data);
    this.unidad = cargo[0].unidad;
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

}
