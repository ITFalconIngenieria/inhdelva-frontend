import { ZonaService } from './../../servicios/zona.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contrato, ContratoMedidores } from '../../Modelos/contratos';
import { ContratoService } from '../../servicios/contrato.service';
import { MedidorPME } from '../../Modelos/medidor';
import { MedidoresService } from '../../servicios/medidores.service';
import { ActoresService } from '../../servicios/actores.service';
import { ClientesVista } from '../../Modelos/actores';
import { ZonaModel } from '../../Modelos/zona';
import { TarifaModel } from '../../Modelos/tarifa';
import { TarifaService } from '../../servicios/tarifa.service';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})

export class ContratosComponent implements OnInit {
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleMedidor = false;
  validateFormContrato: FormGroup;
  validateFormMedidores: FormGroup;
  dateFormat = 'yyyy/MM/dd';
  listaClientes: ClientesVista[] = [];
  listaZonas: ZonaModel[] = [];
  listaTarifas: TarifaModel[] = [];
  accion: string;
  idContrato;
  idMedidorContrato;
  radioValue;
  rangoFechas: boolean;
  // tslint:disable-next-line: max-line-length
  diasGeneracion: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
  listOfDataContrato: Contrato[] = [];
  listOfDataMedidores: ContratoMedidores[] = [];
  listaMedidoresFiltrado: ContratoMedidores[] = [];
  listOfOption: MedidorPME[] = [];
  medidorId;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private medidorService: MedidoresService,
    private actoresService: ActoresService,
    private zonaService: ZonaService,
    private tarifaService: TarifaService
  ) { }

  parserLectura = (value: string) => value.replace('kW ', '');
  formatterLectura = (value: number) => `kW ${value}`;
  parserDias = (value: string) => value.replace('días ', '');
  formatterDias = (value: number) => `días ${value}`;
  parserArea = (value: string) => value.replace('m² ', '');
  formatterArea = (value: number) => `m² ${value}`;
  parserPorcentaje = (value: string) => value.replace('% ', '');
  formatterPorcentaje = (value: number) => `% ${value}`;

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormContrato.controls) {
      this.validateFormContrato.controls[i].markAsDirty();
      this.validateFormContrato.controls[i].updateValueAndValidity();
    }
  }

  guardarContrato() {

    const dataContrato = {
      codigo: this.validateFormContrato.value.codigo,
      clasificacion: this.validateFormContrato.value.clasificacion,
      descripcion: this.validateFormContrato.value.descripcion,
      actorId: this.validateFormContrato.value.actorId,
      fechaCreacion: this.validateFormContrato.value.fechaCreacion[0],
      fechaVenc: this.validateFormContrato.value.fechaCreacion[1],
      diaGeneracion: this.validateFormContrato.value.diaGeneracion,
      diasDisponibles: this.validateFormContrato.value.diasDisponibles,
      observacion: this.validateFormContrato.value.observacion,
      estado: true
    };

    if (this.accion === 'editar') {

      this.contratoService.putContrato(this.idContrato, dataContrato)
        .toPromise()
        .then(
          () => {
            for (const item of this.listOfDataContrato.filter(x => x.id === this.idContrato)) {
              item.codigo = dataContrato.codigo;
              item.clasificacion = dataContrato.clasificacion;
              item.descripcion = dataContrato.descripcion;
              item.actorId = dataContrato.actorId;
              item.fechaCreacion = dataContrato.fechaCreacion;
              item.fechaVenc = dataContrato.fechaVenc;
              item.diaGeneracion = dataContrato.diaGeneracion;
              item.diasDisponibles = dataContrato.diasDisponibles;
              item.observacion = dataContrato.observacion;
              item.estado = dataContrato.estado;
            }

            this.limpiarFormContrato();
          }
        );
    } else {
      this.contratoService.postContrato(dataContrato)
        .toPromise()
        .then(
          (data: Contrato) => {
            this.listOfDataContrato = [...this.listOfDataContrato, data];
            this.limpiarFormContrato();
          }
        );
    }
  }

  editarContrato(data) {
    this.isVisible = true;
    this.accion = 'editar';
    this.idContrato = data.id;
    this.validateFormContrato = this.fb.group({
      codigo: [data.codigo, [Validators.required]],
      clasificacion: [data.clasificacion, [Validators.required]],
      descripcion: [data.descripcion, [Validators.required]],
      actorId: [data.actorId, [Validators.required]],
      fechaCreacion: [[data.fechaCreacion, data.fechaVenc], [Validators.required]],
      diaGeneracion: [data.diaGeneracion, [Validators.required]],
      diasDisponibles: [data.diasDisponibles, [Validators.required]],
      observacion: [data.observacion]
    });
  }

  eliminarContrato(data) {
    this.contratoService.deleteContrato(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.listOfDataContrato = this.listOfDataContrato.filter(x => x.id !== data.id);
        }
      );
  }


  guardarMedidor() {

    const dataMedidor = {
      contratoId: this.idContrato,
      medidorId: this.validateFormMedidores.value.medidorId,
      fechaInicial: (this.validateFormMedidores.value.fechaInicial) ? this.validateFormMedidores.value.fechaInicial[0] : null,
      fechaFinal: (this.validateFormMedidores.value.fechaInicial) ? this.validateFormMedidores.value.fechaInicial[1] : null,
      zonaId: this.validateFormMedidores.value.zonaId,
      area: this.validateFormMedidores.value.area,
      tipoServicioId: parseInt(this.validateFormMedidores.value.tipoServicioId),
      trifasica: this.validateFormMedidores.value.trifasica,
      potencia: this.validateFormMedidores.value.potencia,
      iluminacionTC: (this.validateFormMedidores.value.iluminacionTC === 'false') ? false : true,
      iluminacionP: this.validateFormMedidores.value.iluminacionP,
      sComTC: (this.validateFormMedidores.value.sComTC === 'false') ? false : true,
      sComP: this.validateFormMedidores.value.sComP,
      tarifaId: this.validateFormMedidores.value.tarifaId,
      observacion: this.validateFormMedidores.value.observacion,
      estado: true
    };

    console.log(dataMedidor);


    if (this.accion === 'editar') {

      this.contratoService.putContrato(this.idContrato, dataMedidor)
        .toPromise()
        .then(
          () => {
            for (const item of this.listaMedidoresFiltrado.filter(x => x.id === this.idMedidorContrato)) {
              item.contratoId = dataMedidor.contratoId,
                item.medidorId = dataMedidor.medidorId,
                item.fechaInicial = dataMedidor.fechaInicial,
                item.fechaFinal = dataMedidor.fechaFinal,
                item.zonaId = dataMedidor.zonaId,
                item.area = dataMedidor.area,
                item.tipoServicioId = dataMedidor.tipoServicioId,
                item.trifasica = dataMedidor.trifasica,
                item.potencia = dataMedidor.potencia,
                item.iluminacionTC = dataMedidor.iluminacionTC,
                item.iluminacionP = dataMedidor.iluminacionP,
                item.sComTC = dataMedidor.sComTC,
                item.sComP = dataMedidor.sComP,
                item.tarifaId = dataMedidor.tarifaId,
                item.observacion = dataMedidor.observacion,
                item.estado = true;
            }

            this.limpiarFormMedidores();
          }
        );
    } else {
      this.contratoService.postContratoMedidor(dataMedidor)
        .toPromise()
        .then(
          (data: ContratoMedidores) => {
            this.listaMedidoresFiltrado = [...this.listaMedidoresFiltrado, data];
            this.limpiarFormMedidores();
          }
        );
    }
  }

  editarMedidor(data) {
    this.accion = 'editar';
    this.idMedidorContrato = data.id;

    this.validateFormMedidores = this.fb.group({
      medidorId: [data.medidorId, [Validators.required]],
      fechaInicial: [[data.fechaInicial, data.fechaFinal], [Validators.required]],
      zonaId: [data.zonaId, [Validators.required]],
      area: [data.area, [Validators.required]],
      tipoServicioId: [data.tipoServicioId, [Validators.required]],
      trifasica: [data.trifasica, [Validators.required]],
      potencia: [data.potencia, [Validators.required]],
      iluminacionTC: [(data.iluminacionTC === false) ? 'false' : 'true', [Validators.required]],
      iluminacionP: [data.iluminacionP, [Validators.required]],
      sComTC: [(data.sComTC === false) ? 'false' : 'true', [Validators.required]],
      sComP: [data.sComP, [Validators.required]],
      tarifaId: [data.tarifaId, [Validators.required]],
      observacion: [data.observacion]
    });
  }

  eliminarMedidor(data) {
    this.contratoService.deleteContratoMedidor(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.listaMedidoresFiltrado = this.listaMedidoresFiltrado.filter(x => x.id !== data.id);
        }
      );
  }

  limpiarFormContrato() {
    this.validateFormContrato = this.fb.group({
      codigo: [null, [Validators.required]],
      clasificacion: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      actorId: [null, [Validators.required]],
      fechaCreacion: [null, [Validators.required]],
      diaGeneracion: [1, [Validators.required]],
      diasDisponibles: [1, [Validators.required]],
      observacion: [null]
    });
  }

  limpiarFormMedidores() {
    this.validateFormMedidores = this.fb.group({
      medidorId: [null, [Validators.required]],
      fechaInicial: [null],
      zonaId: [null, [Validators.required]],
      area: [1, [Validators.required]],
      tipoServicioId: [null, [Validators.required]],
      trifasica: [null, [Validators.required]],
      potencia: [1, [Validators.required]],
      iluminacionTC: [null, [Validators.required]],
      iluminacionP: [1, [Validators.required]],
      sComTC: [null, [Validators.required]],
      sComP: [1, [Validators.required]],
      tarifaId: [null, [Validators.required]],
      observacion: [null]
    });
  }

  changeOpcion(data) {
    this.rangoFechas = (data === 'A') ? true : false;
  }
  ngOnInit() {

    this.radioValue = 'A';
    this.rangoFechas = true;

    this.accion = 'nuevo';
    this.medidorService.getMedidoresPME()
      .toPromise()
      .then(
        (data: MedidorPME[]) => this.listOfOption = data
      );

    this.zonaService.getZonas()
      .toPromise()
      .then(
        (data: ZonaModel[]) => this.listaZonas = data
      );

    this.tarifaService.getTarifas()
      .toPromise()
      .then(
        (data: TarifaModel[]) => this.listaTarifas = data
      );

    this.actoresService.getClientes()
      .toPromise()
      .then(
        (data: ClientesVista[]) => this.listaClientes = data
      );

    this.contratoService.getContratos()
      .toPromise()
      .then(
        (data: Contrato[]) => this.listOfDataContrato = data
      );

    this.contratoService.getContratosMedidor()
      .toPromise()
      .then(
        (data: ContratoMedidores[]) => this.listOfDataMedidores = data
      );

    this.limpiarFormContrato();
    this.limpiarFormMedidores();

  }

  onExpandChange(id: number, checked: boolean): void {
    if (checked) {
      this.expandSet.add(id);
    } else {
      this.expandSet.delete(id);
    }
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.limpiarFormContrato();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  showModalMedidor(data): void {
    this.isVisibleMedidor = true;
    this.idContrato = data.id;
    this.listaMedidoresFiltrado = this.listOfDataMedidores.filter(x => x.contratoId === this.idContrato);
  }

  handleCancelMedidor(): void {
    this.isVisibleMedidor = false;
  }

  handleOkMedidor(): void {
    this.isVisibleMedidor = false;
  }

}
