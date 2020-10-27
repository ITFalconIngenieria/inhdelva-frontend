import { ZonaModel } from '../../Modelos/zona';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ZonaService } from '../../servicios/zona.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';

@Component({
  selector: 'app-localizacion',
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.css']
})
export class LocalizacionComponent implements OnInit {
  expandSet = new Set<any>();
  isVisible = false;
  validateForm: FormGroup;
  demoValue = 100;
  radioValue = 'A';
  zonaEdit;
  dataZona;
  listOfDataZona: ZonaModel[] = [];
  accion: string;

  constructor(
    private fb: FormBuilder,
    private zonaService: ZonaService,
    private notification: NzNotificationService
  ) { }

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
    // tslint:disable-next-line: max-line-length
    this.validateForm.value.observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;

    this.dataZona = {
      ...this.validateForm.value,
      estado: true
    };

    if (this.accion === 'editar') {
      this.zonaService.putZona(this.zonaEdit, this.dataZona)
        .toPromise()
        .then(
          () => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            for (const item of this.listOfDataZona.filter(x => x.id === this.zonaEdit)) {
              item.codigo = this.dataZona.codigo;
              item.descripcion = this.dataZona.descripcion;
              item.observacion = this.dataZona.observacion;
              item.estado = this.dataZona.estado;
            }

            this.accion = 'new';

            this.limpiar();
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
      this.zonaService.postZona(this.dataZona)
        .toPromise()
        .then(
          (data: ZonaModel) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataZona = [...this.listOfDataZona, data];
            this.limpiar();
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

  editar(data) {
    this.accion = 'editar';
    this.isVisible = true;

    this.zonaEdit = data.id;
    this.validateForm = this.fb.group({
      codigo: [data.codigo, [Validators.required]],
      descripcion: [data.descripcion],
      observacion: [data.observacion],
    });

  }

  eliminar(data) {
    this.zonaService.deleteZona(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfDataZona = this.listOfDataZona.filter(x => x.id !== data.id);
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

  limpiar() {
    this.validateForm = this.fb.group({
      codigo: [null, [Validators.required]],
      descripcion: [''],
      observacion: [''],
    });
  }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }

  ngOnInit() {

    this.accion = 'new';

    this.zonaService.getZonas()
      .toPromise()
      .then(
        (data: ZonaModel[]) => {
          this.listOfDataZona = data;
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
    this.limpiar();
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.accion = 'new';
    this.limpiar();
  }

  handleOk(): void {
    this.isVisible = false;
  }


}
