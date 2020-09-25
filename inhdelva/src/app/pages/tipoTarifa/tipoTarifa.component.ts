import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatrizHoraria, ParametroTarifaModel, PuntoMedicion, TarifaModel, TipoCargo } from '../../Modelos/tarifa';
import { TarifaService } from '../../servicios/tarifa.service';
import * as moment from 'moment';

@Component({
  selector: 'app-tipoTarifa',
  templateUrl: './tipoTarifa.component.html',
  styleUrls: ['./tipoTarifa.component.css']
})
export class TipoTarifaComponent implements OnInit {

  expandSet = new Set<number>();
  isVisible = false;
  isVisibleParametro = false;
  validateFormTarifa: FormGroup;
  validateFormParametro: FormGroup;

  dateFormat = 'yyyy/MM/dd';
  accion;
  idTarifa;
  idParametro;
  listOfDataTarifa: TarifaModel[] = [];
  listOfDataParametros: ParametroTarifaModel[] = [];
  listOfDataParametrosFiltrado: ParametroTarifaModel[] = [];
  puntoMedicion: PuntoMedicion[] = [];
  matrizHoraria: MatrizHoraria[] = [];
  tipoCargo: TipoCargo[] = [];
  bloqueHorario: any[] = [];
  constructor(
    private fb: FormBuilder,
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
    for (const i in this.validateFormTarifa.value) {
      this.validateFormTarifa.value[i].markAsDirty();
      this.validateFormTarifa.value[i].updateValueAndValidity();
    }
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
          () => {

            for (const item of this.listOfDataTarifa.filter(x => x.id === this.idTarifa)) {
              item.codigo = dataTarifa.codigo;
              item.puntoMedicionId = dataTarifa.puntoMedicionId;
              item.descripcion = dataTarifa.descripcion;
              item.tipo = dataTarifa.tipo;
              item.matrizHorariaId = dataTarifa.matrizHorariaId;
              item.estado = dataTarifa.estado;
            }

            this.limpiarTarifa();
          }
        );
    } else {
      this.tarifaService.postTarifa(dataTarifa)
        .toPromise()
        .then(
          (data: TarifaModel) => {
            console.log(data);
            this.listOfDataTarifa = [...this.listOfDataTarifa, data];

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
      puntoMedicionId: [data.puntoMedicionId, [Validators.required]],
      descripcion: [data.descripcion, [Validators.required]],
      tipo: [(data.tipo === false) ? 'false' : 'true'],
      matrizHorariaId: [data.matrizHorariaId, [Validators.required]],
      observacion: [data.observacion]
    });
  }

  eliminarTarifa(data) {
    this.tarifaService.deleteTarifa(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.listOfDataTarifa = this.listOfDataTarifa.filter(x => x.id !== data.id);
        }
      );
  }

  guardarParametro() {
    const dataParametro = {
      tarifaId: this.idTarifa,
      tipoCargoId: this.validateFormParametro.value.tipoCargoId,
      bloqueHorarioId: this.validateFormParametro.value.bloqueHorarioId,
      fechaInicio: this.validateFormParametro.value.fechaInicio[0],
      fechaFinal: this.validateFormParametro.value.fechaInicio[1],
      valor: this.validateFormParametro.value.valor,
      observacion: this.validateFormParametro.value.observacion,
      estado: true
    };

    if (this.accion === 'editar') {
      this.tarifaService.putTarifaParametro(this.idParametro, dataParametro)
        .toPromise()
        .then(
          () => {
            for (const item of this.listOfDataParametrosFiltrado.filter(x => x.id === this.idParametro)) {
              item.tarifaId = dataParametro.tarifaId;
              item.tipoCargoId = dataParametro.tipoCargoId;
              item.bloqueHorarioId = dataParametro.bloqueHorarioId;
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
      this.tarifaService.postTarifaParametro(dataParametro)
        .toPromise()
        .then(
          (data: ParametroTarifaModel) => {
            console.log(data);
            this.listOfDataParametrosFiltrado = [...this.listOfDataParametrosFiltrado, data];

            this.limpiarParametro();
          }
        );
    }
  }

  editarParametro(data) {
    this.idParametro = data.id;
    this.accion = 'editar';

    this.validateFormParametro = this.fb.group({
      tarifaId: [data.tarifaId, [Validators.required]],
      tipoCargoId: [data.tipoCargoId, [Validators.required]],
      bloqueHorarioId: [data.bloqueHorarioId, [Validators.required]],
      fechaInicio: [[data.fechaInicio, data.fechaFinal]],
      valor: [data.valor, [Validators.required]],
      observacion: [data.observacion]
    });
  }

  eliminarParametro(data) {
    this.tarifaService.deleteTarifaParametro(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.listOfDataParametrosFiltrado = this.listOfDataParametrosFiltrado.filter(x => x.id !== data.id);
        }
      );
  }

  limpiarTarifa() {
    this.validateFormTarifa = this.fb.group({
      codigo: [null, [Validators.required]],
      puntoMedicionId: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      matrizHorariaId: [null, [Validators.required]],
      observacion: [null]
    });
  }

  limpiarParametro() {
    this.validateFormParametro = this.fb.group({
      tarifaId: [null, [Validators.required]],
      tipoCargoId: [null, [Validators.required]],
      bloqueHorarioId: [null, [Validators.required]],
      tipo: [null, [Validators.required]],
      fechaInicio: [null, [Validators.required]],
      valor: [0, [Validators.required]],
      observacion: [null]
    });
  }

  ngOnInit() {

    this.tarifaService.getTarifas()
      .toPromise()
      .then(
        (data: TarifaModel[]) => this.listOfDataTarifa = data
      );

    this.tarifaService.getTarifasParametro()
      .toPromise()
      .then(
        (data: ParametroTarifaModel[]) => this.listOfDataParametros = data
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

    this.limpiarTarifa();
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

  showModalParametro(data): void {
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
    this.isVisibleParametro = false;
  }

  handleOkParametro(): void {
    this.isVisibleParametro = false;
  }

}
