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
  open;
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleMedidor = false;
  isVisibleInterno = false;
  isVisibleOtro = false;
  isVisibleZona = false;
  isVisibleTarifa = false;
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
  listOfDataContrato: any[] = [];
  listOfDataMedidores: any[] = [];
  listaMedidoresFiltrado: any[] = [];
  listOfMedidores: any[] = [];
  listaServicios: any[] = [];
  medidorId;
  fechaInicial: any;
  fechaFinal: any;

  searchValue = '';
  visible = false;
  listOfDisplayData: any[] = [];
  searchValueM = '';
  visibleM = false;
  listOfDisplayDataM: any[] = [];

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

  onOpen(event) {
    this.open = event;
  }

  guardarContrato() {

    if (this.validateFormContrato.value.diaGeneracion < this.validarDia) {

      swal({
        icon: 'error',
        title: 'Día de generacón de factura',
        text: `El día de generación de factura debe ser mayor al rango de factura (${this.validarDia})`
      });
    } else {

      const fechaCreacion = (this.open === undefined) ? moment(moment(this.validateFormContrato.value.fechaCreacion[0]).subtract(1, 'days').format('YYYY-MM-DD')).toISOString() : moment(moment(this.validateFormContrato.value.fechaCreacion[0]).format('YYYY-MM-DD')).toISOString();
      const fechaVenc = (this.open === undefined) ? moment(moment(this.validateFormContrato.value.fechaCreacion[1]).subtract(1, 'days').format('YYYY-MM-DD')).toISOString() : moment(moment(this.validateFormContrato.value.fechaCreacion[1]).format('YYYY-MM-DD')).toISOString();

      const dataContrato = {
        codigo: this.validateFormContrato.value.codigo,
        clasificacion: this.validateFormContrato.value.clasificacion,
        descripcion: this.validateFormContrato.value.descripcion,
        actorId: this.validateFormContrato.value.actorId,
        fechaCreacion: fechaCreacion,
        fechaVenc: fechaVenc,
        diaGeneracion: this.validateFormContrato.value.diaGeneracion,
        diasDisponibles: this.validateFormContrato.value.diasDisponibles,
        exportacion: (this.validateFormContrato.value.exportacion === 'false') ? false : true,
        observacion: (this.validateFormContrato.value.observacion === '') ? this.validateFormContrato.value.observacion : 'N/A',
        estado: true
      };
      this.open = undefined;


      if (this.accion === 'editar') {

        this.contratoService.putContrato(this.idContrato, dataContrato)
          .toPromise()
          .then(
            (data: any) => {
              this.ShowNotification(
                'success',
                'Guardado con éxito',
                'El registro fue guardado con éxito'
              );

              for (const item of this.listOfDataContrato.filter(x => x.id === this.idContrato)) {
                item.codigo = data.codigo;
                item.clasificacion = data.clasificacion;
                item.descripcion = data.descripcion;
                item.actorId = data.actorId;
                item.actor = { ...data.actor }
                item.fechaCreacion = data.fechaCreacion;
                item.fechaVenc = data.fechaVenc;
                item.diaGeneracion = data.diaGeneracion;
                item.diasDisponibles = data.diasDisponibles;
                item.observacion = data.observacion;
                item.exportacion = data.exportacion;
                item.estado = data.estado;
              }
          this.listOfDisplayData = [...this.listOfDataContrato];

              this.accion = 'new';
              this.limpiarFormContrato();
              this.isVisible = false;

            },
            (error) => {

              this.ShowNotification(
                'error',
                'No se pudo guardar',
                'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
              );
              console.log(error);
              this.limpiarFormContrato();
              this.isVisible = false;
              this.accion = 'new';
            }
          );
      } else {
        this.contratoService.postContrato(dataContrato)
          .toPromise()
          .then(
            (data: any) => {
              this.ShowNotification(
                'success',
                'Guardado con éxito',
                'El registro fue guardado con éxito'
              );
              this.listOfDataContrato = [...this.listOfDataContrato, data];
          this.listOfDisplayData = [...this.listOfDataContrato];

              this.limpiarFormContrato();
            },
            (error) => {

              this.ShowNotification(
                'error',
                'No se pudo guardar',
                'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
              );
              console.log(error);
              this.limpiarFormContrato();

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
      fechaCreacion: [[moment(data.fechaCreacion).add(2, 'days').format('YYYY-MM-DD'), moment(data.fechaVenc).add(2, 'days').format('YYYY-MM-DD')], [Validators.required]],
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
          this.listOfDisplayData = [...this.listOfDataContrato];

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

    console.log(this.validateFormMedidores.value.trifasica);

    if (this.validateFormMedidores.value.iluminacionTC === 'true' || this.validateFormMedidores.value.sComTC === 'true') {
      if (this.validateFormMedidores.value.iluminacionP === 0 || this.validateFormMedidores.value.sComP === 0) {
        swal({
          icon: 'error',
          title: 'Error al guardar',
          text: 'Debe ingresar un valor mayor que 0 en "Potencia cargo"'
        });
      }
    } else {
      // tslint:disable-next-line: max-line-length
      const tipoServicio = (this.validateFormMedidores.value.tipoServicioId === null) ? 0 : parseFloat(this.validateFormMedidores.value.tipoServicioId);
      const area = (this.validateFormMedidores.value.area === null) ? 0 : `${this.validateFormMedidores.value.area}`;
      const potencia = (this.validateFormMedidores.value.potencia === null) ? 0 : `${this.validateFormMedidores.value.potencia}`;
      // tslint:disable-next-line: max-line-length
      const iluminacionP = (this.validateFormMedidores.value.iluminacionP === null) ? 0 : `${this.validateFormMedidores.value.iluminacionP}`;
      const sComP = (this.validateFormMedidores.value.sComP === null) ? 0 : `${this.validateFormMedidores.value.sComP}`;
      // tslint:disable-next-line: max-line-length
      const observacion = (this.validateFormMedidores.value.observacion === '' || this.validateFormMedidores.value.observacion === null) ? 'N/A' : this.validateFormMedidores.value.observacion;
      const zonaId = (this.validateFormMedidores.value.zonaId === null) ? 0 : this.validateFormMedidores.value.zonaId;

      let dataMedidor;
      if (this.validateFormMedidores.value.fechaInicial) {
        dataMedidor = {
          contratoId: this.idContrato,
          medidorId: this.validateFormMedidores.value.medidorId,
          fechaInicial: moment(this.validateFormMedidores.value.fechaInicial[0]).subtract(6, 'hours').toISOString(),
          fechaFinal: moment(this.validateFormMedidores.value.fechaInicial[1]).subtract(6, 'hours').toISOString(),
          zonaId,
          area,
          tipoServicioId: tipoServicio,
          // tslint:disable-next-line: max-line-length
          trifasica: (this.validateFormMedidores.value.trifasica === 'false' || this.validateFormMedidores.value.trifasica === null) ? false : true,
          potencia,
          // tslint:disable-next-line: max-line-length
          iluminacionTC: (this.validateFormMedidores.value.iluminacionTC === 'false' || this.validateFormMedidores.value.iluminacionTC === null) ? false : true,
          iluminacionP,
          sComTC: (this.validateFormMedidores.value.sComTC === 'false' || this.validateFormMedidores.value.sComTC === null) ? false : true,
          sComP,
          tarifaId: (this.validateFormMedidores.value.tarifaId === null) ? 0 : this.validateFormMedidores.value.tarifaId,
          observacion,
          estado: true
        };
      } else {
        dataMedidor = {
          contratoId: this.idContrato,
          medidorId: this.validateFormMedidores.value.medidorId,
          fechaInicial: moment(this.fechaInicial).toISOString(),
          fechaFinal: moment(this.fechaFinal).toISOString(),
          zonaId,
          area,
          tipoServicioId: tipoServicio,
          // tslint:disable-next-line: max-line-length
          trifasica: (this.validateFormMedidores.value.trifasica === 'false' || this.validateFormMedidores.value.trifasica === null) ? false : true,
          potencia,
          // tslint:disable-next-line: max-line-length
          iluminacionTC: (this.validateFormMedidores.value.iluminacionTC === 'false' || this.validateFormMedidores.value.iluminacionTC === null) ? false : true,
          iluminacionP,
          sComTC: (this.validateFormMedidores.value.sComTC === 'false' || this.validateFormMedidores.value.sComTC === null) ? false : true,
          sComP,
          tarifaId: (this.validateFormMedidores.value.tarifaId === null) ? 0 : this.validateFormMedidores.value.tarifaId,
          observacion,
          estado: true
        };
      }

      console.log(dataMedidor);


      if (this.accion === 'editar') {

        this.contratoService.putContratoMedidor(this.idMedidorContrato, dataMedidor)
          .toPromise()
          .then(
            (data: any) => {

              this.ShowNotification(
                'success',
                'Guardado con éxito',
                'El registro fue guardado con éxito'
              );
              for (const item of this.listaMedidoresFiltrado.filter(x => x.id === this.idMedidorContrato)) {
                item.contratoId = data.contratoId,
                  item.contrato = { ...data.contrato },
                  item.medidorId = data.medidorId,
                  item.medidor = { ...data.medidor },
                  item.fechaInicial = data.fechaInicial,
                  item.fechaFinal = data.fechaFinal,
                  item.zonaId = data.zonaId,
                  item.zona = { ...data.zona },
                  item.area = data.area,
                  item.tipoServicioId = data.tipoServicioId,
                  item.tipoServicio = { ...data.tipoServicio },
                  item.trifasica = data.trifasica,
                  item.potencia = data.potencia,
                  item.iluminacionTC = data.iluminacionTC,
                  item.iluminacionP = data.iluminacionP,
                  item.sComTC = data.sComTC,
                  item.sComP = data.sComP,
                  item.tarifaId = data.tarifaId,
                  item.tarifa = { ...data.tarifa },
                  item.observacion = data.observacion,
                  item.estado = data.estado;
              }

    this.listOfDisplayDataM = [...this.listaMedidoresFiltrado];

              for (const item of this.listOfDataMedidores.filter(x => x.id === this.idMedidorContrato)) {
                item.contratoId = data.contratoId,
                  item.contrato = { ...data.contrato },
                  item.medidorId = data.medidorId,
                  item.medidor = { ...data.medidor },
                  item.fechaInicial = data.fechaInicial,
                  item.fechaFinal = data.fechaFinal,
                  item.zonaId = data.zonaId,
                  item.zona = { ...data.zona },
                  item.area = data.area,
                  item.tipoServicioId = data.tipoServicioId,
                  item.tipoServicio = { ...data.tipoServicio },
                  item.trifasica = data.trifasica,
                  item.potencia = data.potencia,
                  item.iluminacionTC = data.iluminacionTC,
                  item.iluminacionP = data.iluminacionP,
                  item.sComTC = data.sComTC,
                  item.sComP = data.sComP,
                  item.tarifaId = data.tarifaId,
                  item.tarifa = { ...data.tarifa },
                  item.observacion = data.observacion,
                  item.estado = data.estado;
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
              this.limpiarFormMedidores();
              this.accion = 'new';

            }

          );
      } else {
        this.contratoService.postContratoMedidor(dataMedidor)
          .toPromise()
          .then(
            (data: any) => {

              this.ShowNotification(
                'success',
                'Guardado con éxito',
                'El registro fue guardado con éxito'
              );
              this.listaMedidoresFiltrado = [...this.listaMedidoresFiltrado, data];
              this.listOfDataMedidores = [...this.listOfDataMedidores, data];
              this.limpiarFormMedidores();
            },
            (error) => {

              this.ShowNotification(
                'error',
                'No se pudo guardar',
                'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
              );
              console.log(error);
              this.limpiarFormMedidores();

            }

          );
      }
    }

  }

  editarMedidor(data) {
    console.log(data);

    this.accion = 'editar';
    this.idMedidorContrato = data.id;
    const valor = (data.fechaFinal) ? 'B' : 'A';
    this.radioValue = (data.fechaFinal) ? 'B' : 'A';
    this.changeOpcion(valor);

    if (data.fechaInicial) {
      this.validateFormMedidores = this.fb.group({
        medidorId: [data.medidorId, [Validators.required]],
        fechaInicial: [[moment(data.fechaInicial).add(6, 'hours').format('YYYY-MM-DD HH:mm'), moment(data.fechaFinal).add(6, 'hours').format('YYYY-MM-DD HH:mm')]],
        zonaId: [data.zonaId],
        area: [data.area],
        tipoServicioId: [data.tipoServicioId],
        trifasica: [data.trifasica],
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
        zonaId: [data.zonaId],
        area: [data.area],
        tipoServicioId: [data.tipoServicioId],
        trifasica: [data.trifasica],
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
          this.listOfDataMedidores = this.listOfDataMedidores.filter(x => x.id !== data.id);
    this.listOfDisplayDataM = [...this.listaMedidoresFiltrado];

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

  onChange(result: Date): void {
    console.log('Selected Time: ', result);
  }

  onOk(result: Date | Date[] | null): void {
  }

  onCalendarChange(result: Array<Date | null>): void {
    console.log('onCalendarChange', result);
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
      zonaId: [null],
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

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDataContrato.filter((item: any) => (item.codigo.indexOf(this.searchValue) !== -1) || (item.actor.codigo.indexOf(this.searchValue) !== -1) || (item.clasificacion.indexOf(this.searchValue) !== -1));
  }

  resetM(): void {
    this.searchValueM = '';
    this.searchM();
  }

  searchM(): void {
    this.visibleM = false;
    this.listOfDisplayDataM = this.listaMedidoresFiltrado.filter((item: any) => (item.medidor.codigo.indexOf(this.searchValueM) !== -1));
  }

  ngOnInit() {

    this.radioValue = 'A';
    this.rangoFechas = true;

    this.accion = 'new';
    this.medidorService.getMedidores()
      .toPromise()
      .then(
        (data: any) => {
          this.listOfMedidores = data;
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
        (data: any[]) => this.listaServicios = data
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

    this.actoresService.getActores()
      .toPromise()
      .then(
        (data: ClientesVista[]) => this.listaClientes = data
      );

    this.contratoService.getContratosRelacion()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfDataContrato = data;
          this.listOfDisplayData = [...this.listOfDataContrato];
        }
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

    this.contratoService.getContratosMedidorRelacion()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfDataMedidores = data;

        }
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
    this.fechaInicial = data.fechaCreacion;
    this.fechaFinal = data.fechaVenc;

    switch (data.clasificacion) {
      case 'I': {
        this.isVisibleInterno = false;
        this.isVisibleOtro = true;
        this.isVisibleZona = false;
        this.isVisibleTarifa = true;

        break;
      }
      case 'C': {
        this.isVisibleInterno = true;
        this.isVisibleOtro = false;
        this.isVisibleZona = false;
        this.isVisibleTarifa = false;

        break;
      }
      case 'P': {
        this.isVisibleInterno = true;
        this.isVisibleOtro = true;
        this.isVisibleZona = true;
        this.isVisibleTarifa = false;

        break;
      }
      default:
        break;
    }

    this.listaMedidoresFiltrado = this.listOfDataMedidores.filter(x => x.contratoId === this.idContrato);
    this.listOfDisplayDataM = [...this.listaMedidoresFiltrado];
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
