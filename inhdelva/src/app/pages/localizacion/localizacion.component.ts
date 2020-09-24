import { ZonaModel } from '../../Modelos/zona';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZonaService } from '../../servicios/zona.service';

@Component({
  selector: 'app-localizacion',
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.css']
})
export class LocalizacionComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private zonaService: ZonaService

  ) { }

  expandSet = new Set<any>();
  isVisible = false;
  validateForm: FormGroup;
  demoValue = 100;
  radioValue = 'A';
  zonaEdit;
  dataZona;
  listOfDataZona: ZonaModel[] = [];
  accion: string;

  parserArea = (value: string) => value.replace(' m²', '');
  formatterArea = (value: number) => `${value} m²`;

  onExpandChange(id: any, checked: boolean): void {
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

  guardar() {

    this.dataZona = {
      ...this.validateForm.value,
      estado: true
    };

    if (this.accion === 'editar') {
      this.zonaService.putZona(this.zonaEdit, this.dataZona)
        .toPromise()
        .then(
          () => {
            for (const item of this.listOfDataZona.filter(x => x.id === this.zonaEdit)) {
              item.codigo = this.dataZona.codigo;
              item.descripcion = this.dataZona.descripcion;
              item.observacion = this.dataZona.observacion;
              item.estado = this.dataZona.estado;
            }

            this.validateForm = this.fb.group({
              codigo: [null, [Validators.required]],
              descripcion: [null, [Validators.required]],
              observacion: [null],
            });
          }
        );
    } else {
      this.zonaService.postZona(this.dataZona)
        .toPromise()
        .then(
          (data: ZonaModel) => {
            this.listOfDataZona = [...this.listOfDataZona, data];
            this.validateForm = this.fb.group({
              codigo: [null, [Validators.required]],
              descripcion: [null, [Validators.required]],
              observacion: [null],
            });
          }
        );
    }

  }

  ngOnInit() {

    this.accion = 'nuevo';

    this.zonaService.getZonas()
      .toPromise()
      .then(
        (data: ZonaModel[]) => {
          this.listOfDataZona = data;
        }
      );

    this.validateForm = this.fb.group({
      codigo: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      observacion: [null],
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm = this.fb.group({
      codigo: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      observacion: [null],
    });
  }

  handleOk(): void {
    this.isVisible = false;
  }

  editar(data) {
    this.accion = 'editar';
    this.isVisible = true;

    this.zonaEdit = data.id;
    this.validateForm = this.fb.group({
      codigo: [data.codigo, [Validators.required]],
      descripcion: [data.descripcion, [Validators.required]],
      observacion: [data.observacion, [Validators.required]],
    });

  }

  eliminar(data) {
    this.zonaService.deleteZona(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.listOfDataZona = this.listOfDataZona.filter(x => x.id !== data.id);
        }
      );
  }
}
