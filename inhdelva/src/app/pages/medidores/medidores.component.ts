import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MedidoresService } from '../../servicios/medidores.service';
import { MedidorPME, RolloverModel } from '../../Modelos/medidor';
import * as moment from 'moment';
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
  observacion: string;
  codigoMedidor;

  accion;
  idMedidor;
  idRollover;
  medidoresPME: any[] = [];
  listOfDataMedidores: MedidorPME[] = [];
  listOfDataRollover: RolloverModel[] = [];

  constructor(
    private fb: FormBuilder,
    private medidoresService: MedidoresService
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
      energia: this.validateForm.controls.energia.value,
      lecturaAnterior: this.validateForm.controls.lecturaAnterior.value,
      lecturaNueva: this.validateForm.controls.lecturaNueva.value,
      observacion: this.validateForm.controls.observacion.value,
      estado: true
    };

    if (this.accion === 'editar') {
      this.medidoresService.putRollovers(this.idRollover, dataRollover)
        .toPromise()
        .then(
          (data) => {
            console.log(data);
            this.validateForm = this.fb.group({
              fecha: [null, [Validators.required]],
              energia: [null, [Validators.required]],
              lecturaAnterior: [0, [Validators.required]],
              lecturaNueva: [0, [Validators.required]],
              observacion: [null]
            });

          }
        );
    } else {
      this.medidoresService.postRollovers(dataRollover)
        .toPromise()
        .then(
          (data) => {
            console.log(data);
            this.validateForm = this.fb.group({
              fecha: [null, [Validators.required]],
              energia: [null, [Validators.required]],
              lecturaAnterior: [0, [Validators.required]],
              lecturaNueva: [0, [Validators.required]],
              observacion: [null]
            });

          }
        );
    }
  }

  editarRollover(data) {
    this.idRollover = data.id;
    this.accion = 'editar';
    this.validateForm = this.fb.group({
      fecha: [moment(data.fecha).format('YYYY/MM/DD'), [Validators.required]],
      energia: [data.energia, [Validators.required]],
      lecturaAnterior: [data.lecturaAnterior, [Validators.required]],
      lecturaNueva: [data.lecturaNueva, [Validators.required]],
      observacion: [data.observacion]
    });
  }

  busquedadMedidor() {
    const codigo = this.codigo;

    const medidor: any[] = this.medidoresPME.filter(x => x.nombre === codigo);

    console.log(medidor);

    if (medidor.length > 0) {
      console.log('Encontre');

    } else {
      this.codigo = '';
      swal({
        icon: 'warning',
        text: 'No se encontró ese cliente'
      });
    }

  }

  ngOnInit() {
    this.accion = 'nuevo';
    this.medidoresService.getMedidoresPME()
      .toPromise()
      .then(
        (data: MedidorPME[]) => {
          this.listOfDataMedidores = data;
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
          console.log(data);
          this.medidoresPME = data;
        }
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
  }

  handleCancelRollover(): void {
    this.isVisibleRollover = false;
  }

  handleOkRollover(): void {
    this.isVisibleRollover = false;
  }

}
