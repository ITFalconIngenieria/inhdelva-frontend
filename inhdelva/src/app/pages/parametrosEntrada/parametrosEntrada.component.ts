import { ParametroEntradaService } from './../../servicios/parametroEntrada.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parametro } from '../../Modelos/parametros';
import { TarifaService } from '../../servicios/tarifa.service';
import { TipoCargo } from '../../Modelos/tarifa';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';

@Component({
  selector: 'app-parametrosEntrada',
  templateUrl: './parametrosEntrada.component.html',
  styleUrls: ['./parametrosEntrada.component.css']
})
export class ParametrosEntradaComponent implements OnInit {

  expandSet = new Set<number>();
  isVisible = false;
  validateForm: FormGroup;
  dateFormat = 'yyyy/MM/dd';
  accion;
  idParametro;
  listOfDataParametro: Parametro[] = [];
  tipoCargo: TipoCargo[] = [];

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

  guardarParametro() {
    // tslint:disable-next-line: max-line-length
    const observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;

    const dataParametro = {
      tipoCargoId: this.validateForm.value.tipoCargoId,
      fechaInicio: this.validateForm.value.fechaInicio[0],
      fechaFinal: this.validateForm.value.fechaInicio[1],
      valor: this.validateForm.value.valor,
      observacion,
      estado: true
    };

    if (this.accion === 'editar') {
      this.parametroServce.putParametro(this.idParametro, dataParametro)
        .toPromise()
        .then(
          () => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            for (const item of this.listOfDataParametro.filter(x => x.id === this.idParametro)) {
              item.tipoCargoId = dataParametro.tipoCargoId;
              item.fechaInicio = dataParametro.fechaInicio;
              item.fechaFinal = dataParametro.fechaFinal;
              item.valor = dataParametro.valor;
              item.observacion = dataParametro.observacion;
              item.estado = dataParametro.estado;
            }
            this.accion = 'new';
            this.limpiarParametro();
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
      this.parametroServce.postParametro(dataParametro)
        .toPromise()
        .then(
          (data: Parametro) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataParametro = [...this.listOfDataParametro, data];

            this.limpiarParametro();
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

  editarParametro(data) {
    this.idParametro = data.id;
    this.accion = 'editar';
    this.isVisible = true;

    this.validateForm = this.fb.group({
      tipoCargoId: [data.tipoCargoId, [Validators.required]],
      fechaInicio: [[data.fechaInicio, data.fechaFinal], [Validators.required]],
      valor: [data.valor, [Validators.required]],
      observacion: [data.observacion]
    });
  }

  eliminarParametro(data) {
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

  limpiarParametro() {
    this.validateForm = this.fb.group({
      tipoCargoId: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      valor: [1, [Validators.required]],
      observacion: ['']
    });
  }

  ngOnInit() {

    this.parametroServce.getParametro()
      .toPromise()
      .then(
        (data: Parametro[]) => {
          this.listOfDataParametro = data;
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
