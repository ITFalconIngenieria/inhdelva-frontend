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
  permiso: any;
  searchValue = '';
  visible = false;
  listOfDisplayData: any[] = [];


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
            this.listOfDisplayData = [...this.listOfDataZona]

            this.accion = 'new';
            this.limpiar();
            this.isVisible = false;
          },
          (error) => {

            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.limpiar();
            this.accion = 'new';
            this.isVisible = false;
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
            this.listOfDisplayData = [...this.listOfDataZona]

            this.limpiar();
          },
          (error) => {

            this.ShowNotification(
              'error',
              'No se pudo guardar',
              'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
            );
            console.log(error);
            this.limpiar();
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
    swal({
      title: "¿Está seguro de borrar el registro?",
      // text: "Una vez eliminado el registro ",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
      .then((willDelete) => {
        if (willDelete) {
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
                this.listOfDisplayData = [...this.listOfDataZona]

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

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDataZona.filter((item: any) => (item.codigo.indexOf(this.searchValue) !== -1));
  }

  ngOnInit() {

    this.accion = 'new';
    this.permiso = (localStorage.getItem('permiso') === 'true') ? true : false;
    this.zonaService.getZonas()
      .toPromise()
      .then(
        (data: ZonaModel[]) => {
          this.listOfDataZona = data;
          this.listOfDisplayData = [...this.listOfDataZona]
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

  sort() {
    let array = this.listOfDataZona.sort(function (a, b) {
      return a.codigo.localeCompare(b.codigo);
    });
    this.listOfDisplayData = [...array]
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
