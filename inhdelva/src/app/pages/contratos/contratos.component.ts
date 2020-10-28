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
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';
import { RangoFechaService } from '../../servicios/rangoFecha.service';
import * as moment from 'moment';

interface Medidor {
  id: number;
  codigo: string;
}

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})

export class ContratosComponent implements OnInit {
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleMedidor = false;
  isVisibleInterno = false;
  isVisibleOtro = false;
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
  validarDia;
  // tslint:disable-next-line: max-line-length
  diasGeneracion: any[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29];
  listOfDataContrato: Contrato[] = [];
  listOfDataMedidores: ContratoMedidores[] = [];
  listaMedidoresFiltrado: ContratoMedidores[] = [];
  listOfMedidores: Medidor[] = [];
  listaServicios: any[] = [];
  medidorId;

  constructor(
    private fb: FormBuilder,
    private contratoService: ContratoService,
    private medidorService: MedidoresService,
    private actoresService: ActoresService,
    private zonaService: ZonaService,
    private tarifaService: TarifaService,
    private notification: NzNotificationService,
    private rangoFactura: RangoFechaService
  ) { }

  parserLectura = (value: string) => value.replace('kW ', '');
  formatterLectura = (value: number) => `${value} kW`;
  parserDias = (value: string) => value.replace('días ', '');
  formatterDias = (value: number) => `${value} días`;
  parserArea = (value: string) => value.replace('m² ', '');
  formatterArea = (value: number) => `${value} m²`;
  parserPorcentaje = (value: string) => value.replace('% ', '');
  formatterPorcentaje = (value: number) => `${value} %`;

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateFormContrato.controls) {
      this.validateFormContrato.controls[i].markAsDirty();
      this.validateFormContrato.controls[i].updateValueAndValidity();
    }
  }

  guardarContrato() {

    if (this.validateFormContrato.value.diaGeneracion < this.validarDia) {

      swal({
        icon: 'error',
        title: 'Día de generacón de factura',
        text: `El día de generación de factura debe ser mayor al rango de factura (${this.validarDia})`
      });
    } else {
      const dataContrato = {
        codigo: this.validateFormContrato.value.codigo,
        clasificacion: this.validateFormContrato.value.clasificacion,
        descripcion: this.validateFormContrato.value.descripcion,
        actorId: this.validateFormContrato.value.actorId,
        fechaCreacion: moment(this.validateFormContrato.value.fechaCreacion[0]).toISOString(),
        fechaVenc: moment(this.validateFormContrato.value.fechaCreacion[1]).toISOString(),
        diaGeneracion: this.validateFormContrato.value.diaGeneracion,
        diasDisponibles: this.validateFormContrato.value.diasDisponibles,
        exportacion: (this.validateFormContrato.value.exportacion === 'false') ? false : true,
        observacion: (this.validateFormContrato.value.observacion === '') ? this.validateFormContrato.value.observacion : 'N/A',
        estado: true
      };

      if (this.accion === 'editar') {

        this.contratoService.putContrato(this.idContrato, dataContrato)
          .toPromise()
          .then(
            () => {

              this.ShowNotification(
                'success',
                'Guardado con éxito',
                'El registro fue guardado con éxito'
              );

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
                item.exportacion = dataContrato.exportacion;
                item.estado = dataContrato.estado;
              }
              this.accion = 'new';
              this.limpiarFormContrato();
              console.log('editar');

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
        this.contratoService.postContrato(dataContrato)
          .toPromise()
          .then(
            (data: Contrato) => {
              console.log('post');
              this.ShowNotification(
                'success',
                'Guardado con éxito',
                'El registro fue guardado con éxito'
              );
              this.listOfDataContrato = [...this.listOfDataContrato, data];
              this.limpiarFormContrato();
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
      exportacion: [(data.exportacion === false) ? 'false' : 'true'],
      observacion: [data.observacion]
    });
  }

  eliminarContrato(data) {
    this.contratoService.deleteContrato(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );

          this.listOfDataContrato = this.listOfDataContrato.filter(x => x.id !== data.id);
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


  guardarMedidor() {

    // tslint:disable-next-line: max-line-length
    const tipoServicio = (this.validateFormMedidores.value.tipoServicioId === null) ? 0 : parseInt(this.validateFormMedidores.value.tipoServicioId);
    const area = (this.validateFormMedidores.value.area === null) ? 0 : this.validateFormMedidores.value.area;
    const potencia = (this.validateFormMedidores.value.potencia === null) ? 0 : this.validateFormMedidores.value.potencia;
    const iluminacionP = (this.validateFormMedidores.value.iluminacionP === null) ? 0 : this.validateFormMedidores.value.iluminacionP;
    const sComP = (this.validateFormMedidores.value.sComP === null) ? 0 : this.validateFormMedidores.value.sComP;
    // tslint:disable-next-line: max-line-length
    const observacion = (this.validateFormMedidores.value.observacion === '' || this.validateFormMedidores.value.observacion === null) ? 'N/A' : this.validateFormMedidores.value.observacion;

    console.log(this.validateFormMedidores.value.observacion);

    let dataMedidor;
    if (this.validateFormMedidores.value.fechaInicial) {
      dataMedidor = {
        contratoId: this.idContrato,
        medidorId: this.validateFormMedidores.value.medidorId,
        fechaInicial: this.validateFormMedidores.value.fechaInicial[0],
        fechaFinal: this.validateFormMedidores.value.fechaInicial[1],
        zonaId: this.validateFormMedidores.value.zonaId,
        area,
        tipoServicioId: tipoServicio,
        trifasica: this.validateFormMedidores.value.trifasica,
        potencia,
        // tslint:disable-next-line: max-line-length
        iluminacionTC: (this.validateFormMedidores.value.iluminacionTC === 'false' || this.validateFormMedidores.value.iluminacionTC === null) ? false : true,
        iluminacionP,
        sComTC: (this.validateFormMedidores.value.sComTC === 'false' || this.validateFormMedidores.value.sComTC === null) ? false : true,
        sComP,
        tarifaId: (this.validateFormMedidores.value.tarifaId === null) ? 2007 : this.validateFormMedidores.value.tarifaId,
        observacion,
        estado: true
      };
    } else {
      dataMedidor = {
        contratoId: this.idContrato,
        medidorId: this.validateFormMedidores.value.medidorId,
        zonaId: this.validateFormMedidores.value.zonaId,
        area,
        tipoServicioId: tipoServicio,
        trifasica: this.validateFormMedidores.value.trifasica,
        potencia,
        // tslint:disable-next-line: max-line-length
        iluminacionTC: (this.validateFormMedidores.value.iluminacionTC === 'false' || this.validateFormMedidores.value.iluminacionTC === null) ? false : true,
        iluminacionP,
        sComTC: (this.validateFormMedidores.value.sComTC === 'false' || this.validateFormMedidores.value.sComTC === null) ? false : true,
        sComP,
        tarifaId: (this.validateFormMedidores.value.tarifaId === null) ? 2007 : this.validateFormMedidores.value.tarifaId,
        observacion,
        estado: true
      };
    }

    if (this.accion === 'editar') {

      this.contratoService.putContratoMedidor(this.idContrato, dataMedidor)
        .toPromise()
        .then(
          () => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
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

            this.accion = 'new';

            this.limpiarFormMedidores();
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
      this.contratoService.postContratoMedidor(dataMedidor)
        .toPromise()
        .then(
          (data: ContratoMedidores) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listaMedidoresFiltrado = [...this.listaMedidoresFiltrado, data];
            this.limpiarFormMedidores();
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
    this.accion = 'editar';
    this.idMedidorContrato = data.id;
    const valor = (data.fechaFinal) ? 'B' : 'A';
    this.radioValue = (data.fechaFinal) ? 'B' : 'A';
    this.changeOpcion(valor);

    console.log(data);

    if (data.fechaInicial) {
      this.validateFormMedidores = this.fb.group({
        medidorId: [data.medidorId, [Validators.required]],
        fechaInicial: [[data.fechaInicial, data.fechaFinal]],
        zonaId: [data.zonaId, [Validators.required]],
        area: [data.area],
        tipoServicioId: [data.tipoServicioId],
        trifasica: [data.trifasica,],
        potencia: [data.potencia],
        iluminacionTC: [(data.iluminacionTC === false) ? 'false' : 'true'],
        iluminacionP: [data.iluminacionP],
        sComTC: [(data.sComTC === false) ? 'false' : 'true'],
        sComP: [data.sComP],
        tarifaId: [data.tarifaId],
        observacion: [data.observacion]
      });
    } else {
      this.validateFormMedidores = this.fb.group({
        medidorId: [data.medidorId, [Validators.required]],
        fechaInicial: [null],
        zonaId: [data.zonaId, [Validators.required]],
        area: [data.area],
        tipoServicioId: [data.tipoServicioId],
        trifasica: [data.trifasica,],
        potencia: [data.potencia],
        iluminacionTC: [(data.iluminacionTC === false) ? 'false' : 'true'],
        iluminacionP: [data.iluminacionP],
        sComTC: [(data.sComTC === false) ? 'false' : 'true'],
        sComP: [data.sComP],
        tarifaId: [data.tarifaId],
        observacion: [data.observacion]
      });
    }

  }

  eliminarMedidor(data) {
    this.contratoService.deleteContratoMedidor(data.id, { estado: false })
      .toPromise()
      .then(
        () => {

          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );

          this.listaMedidoresFiltrado = this.listaMedidoresFiltrado.filter(x => x.id !== data.id);
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

  limpiarFormContrato() {
    this.validateFormContrato = this.fb.group({
      codigo: [null, [Validators.required]],
      clasificacion: [null, [Validators.required]],
      descripcion: [''],
      actorId: [null, [Validators.required]],
      fechaCreacion: [null],
      diaGeneracion: [1],
      diasDisponibles: [1],
      exportacion: ['false'],
      observacion: ['']
    });
  }

  limpiarFormMedidores() {
    this.validateFormMedidores = this.fb.group({
      medidorId: [null, [Validators.required]],
      fechaInicial: [null],
      zonaId: [null, [Validators.required]],
      area: [0],
      tipoServicioId: [0],
      trifasica: ['false'],
      potencia: [0],
      iluminacionTC: ['false'],
      iluminacionP: [0],
      sComTC: ['false'],
      sComP: [0],
      tarifaId: [null],
      observacion: ['']
    });
  }

  changeOpcion(data) {
    this.rangoFechas = (data === 'A') ? true : false;
  }

  ngOnInit() {

    this.radioValue = 'A';
    this.rangoFechas = true;

    this.accion = 'new';
    this.medidorService.getMedidoresPME()
      .toPromise()
      .then(
        (data: MedidorPME[]) => {
          for (let x = 0; x < data.length; x++) {
            this.listOfMedidores = [{
              id: data[x].id,
              codigo: data[x].codigo.substr(9)
            }, ...this.listOfMedidores];
          }
        }
      );

    this.rangoFactura.getRangos()
      .toPromise()
      .then(
        (data: any[]) => {
          this.validarDia = data[data.length - 1].DiaInicio;
        }
      );

    this.contratoService.getTipoServicio()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listaServicios = data
          console.log(this.listaServicios);
        }
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
        ,
        (error) => {
          swal({
            icon: 'error',
            title: 'No se pudo conectar al servidor',
            text: 'Revise su conexión a internet o comuníquese con el proveedor.'
          });

          console.log(error);
        }
      );

    this.contratoService.getContratosMedidor()
      .toPromise()
      .then(
        (data: ContratoMedidores[]) => this.listOfDataMedidores = data
      );

    this.limpiarFormContrato();
    this.limpiarFormMedidores();

  }

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

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.accion = 'new';
    this.isVisible = false;
    this.limpiarFormContrato();
  }

  handleOk(): void {
    this.isVisible = false;
  }

  showModalMedidor(data): void {
    this.isVisibleMedidor = true;
    this.idContrato = data.id;

    this.isVisibleInterno = (data.clasificacion === 'I') ? false : true;
    this.isVisibleOtro = (data.clasificacion === 'C' || data.clasificacion === 'P') ? false : true;
    this.listaMedidoresFiltrado = this.listOfDataMedidores.filter(x => x.contratoId === this.idContrato);
  }

  handleCancelMedidor(): void {
    this.accion = 'new';
    this.isVisibleMedidor = false;
    this.limpiarFormMedidores();
  }

  handleOkMedidor(): void {
    this.isVisibleMedidor = false;
  }

}
