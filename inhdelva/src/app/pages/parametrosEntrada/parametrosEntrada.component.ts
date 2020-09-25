import { ParametroEntradaService } from './../../servicios/parametroEntrada.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parametro } from '../../Modelos/parametros';
import { TarifaService } from '../../servicios/tarifa.service';
import { TipoCargo } from '../../Modelos/tarifa';

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
    private tarifaService: TarifaService
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

  guardarParametro() {
    const dataParametro = {
      tipoCargoId: this.validateForm.controls.tipoCargoId.value,
      fechaInicio: this.validateForm.controls.fechaInicio[0].value,
      fechaFinal: this.validateForm.controls.fechaInicio[1].value,
      valor: this.validateForm.controls.valor.value,
      observacion: this.validateForm.controls.observacion.value,
      estado: true
    };

    if (this.accion === 'editar') {
      this.parametroServce.putParametro(this.idParametro, dataParametro)
        .toPromise()
        .then(
          () => {

            for (const item of this.listOfDataParametro.filter(x => x.id === this.idParametro)) {
              item.tipoCargoId = dataParametro.tipoCargoId;
              item.fechaInicio = dataParametro.fechaInicio;
              item.fechaFinal = dataParametro.fechaFinal;
              item.valor = dataParametro.valor;
              item.observacion = dataParametro.observacion;
              item.estado = dataParametro.estado;
            }

            this.limpiarParametro();
          }
        );
    } else {
      this.parametroServce.postParametro(dataParametro)
        .toPromise()
        .then(
          (data: Parametro) => {
            this.listOfDataParametro = [...this.listOfDataParametro, data];

            this.limpiarParametro();
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
      tipo: [data.valor, [Validators.required]],
      observacion: [data.observacion]
    });
  }

  eliminarParametro(data) {
    this.parametroServce.deleteParametro(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.listOfDataParametro = this.listOfDataParametro.filter(x => x.id !== data.id);
        }
      );
  }

  limpiarParametro() {
    this.validateForm = this.fb.group({
      tipoCargoId: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      valor: [1, [Validators.required]],
      observacion: [null]
    });
  }

  ngOnInit() {

    this.parametroServce.getParametro()
      .toPromise()
      .then(
        (data: Parametro[]) => {
          this.listOfDataParametro = data;
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
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

}
