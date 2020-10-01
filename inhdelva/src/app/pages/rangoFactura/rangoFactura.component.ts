// import { any } from '../../Modelos/zona';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ZonaService } from '../../servicios/zona.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-rangoFactura',
  templateUrl: './rangoFactura.component.html',
  styleUrls: ['./rangoFactura.component.css']
})
export class RangoFacturaComponent implements OnInit {
  expandSet = new Set<any>();
  isVisible = false;
  validateForm: FormGroup;
  demoValue = 100;
  radioValue = 'A';
  zonaEdit;
  dataZona;
  listOfDataZona: any[] = [];
  accion: string;
  time = new Date();

  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park'
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park'
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park'
    }
  ];

  constructor(
    private fb: FormBuilder,
    // private zonaService: ZonaService,
    private notification: NzNotificationService
  ) { }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

  }

  guardar() {

    // this.dataZona = {
    //   ...this.validateForm.value,
    //   estado: true
    // };

    // if (this.accion === 'editar') {
    //   this.zonaService.putZona(this.zonaEdit, this.dataZona)
    //     .toPromise()
    //     .then(
    //       () => {
    //         this.ShowNotification(
    //           'success',
    //           'Guardado con éxito',
    //           'El registro fue guardado con éxito'
    //         );

    //         for (const item of this.listOfDataZona.filter(x => x.id === this.zonaEdit)) {
    //           item.codigo = this.dataZona.codigo;
    //           item.descripcion = this.dataZona.descripcion;
    //           item.observacion = this.dataZona.observacion;
    //           item.estado = this.dataZona.estado;
    //         }

    //         this.validateForm = this.fb.group({
    //           codigo: [null, [Validators.required]],
    //           descripcion: [null, [Validators.required]],
    //           observacion: [null],
    //         });
    //       },
    //       (error) => {

    //         this.ShowNotification(
    //           'error',
    //           'No se pudo guardar',
    //           'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
    //         );
    //         console.log(error);
    //       }
    //     );
    // } else {
    //   this.zonaService.postZona(this.dataZona)
    //     .toPromise()
    //     .then(
    //       (data: any) => {
    //         this.ShowNotification(
    //           'success',
    //           'Guardado con éxito',
    //           'El registro fue guardado con éxito'
    //         );
    //         this.listOfDataZona = [...this.listOfDataZona, data];
    //         this.validateForm = this.fb.group({
    //           codigo: [null, [Validators.required]],
    //           descripcion: [null, [Validators.required]],
    //           observacion: [null],
    //         });
    //       },
    //       (error) => {

    //         this.ShowNotification(
    //           'error',
    //           'No se pudo guardar',
    //           'El registro no pudo ser guardado, por favor revise los datos ingresados sino comuníquese con el proveedor.'
    //         );
    //         console.log(error);
    //       }
    //     );
    // }

  }

  ShowNotification(type: string, titulo: string, mensaje: string): void {
    this.notification.create(
      type,
      titulo,
      mensaje
    );
  }



  ngOnInit() {

    this.accion = 'nuevo';

    // this.zonaService.getZonas()
    //   .toPromise()
    //   .then(
    //     (data: any[]) => {
    //       this.listOfDataZona = data;
    //     },
    //     (error) => {
    //       swal({
    //         icon: 'error',
    //         title: 'No se pudo conectar al servidor',
    //         text: 'Revise su conexión a internet o comuníquese con el proveedor.'
    //       });
    //       console.log(error);
    //     }
    //   );

    this.validateForm = this.fb.group({
      tipo: [null, [Validators.required]],
      diaInicio: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      diaFin: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      horaInicio: [null, [Validators.required]],
      horaFin: [null, [Validators.required]],
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
    this.validateForm = this.fb.group({
      tipo: [null, [Validators.required]],
      diaInicio: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      diaFin: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      horaInicio: [null, [Validators.required]],
      horaFin: [null, [Validators.required]],
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
      tipo: [null, [Validators.required]],
      diaInicio: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      diaFin: [1, [Validators.required, Validators.minLength(1), Validators.maxLength(31)]],
      horaInicio: [null, [Validators.required]],
      horaFin: [null, [Validators.required]],
    });

  }

  eliminar(data) {
    // this.zonaService.deleteZona(data.id, { estado: false })
    //   .toPromise()
    //   .then(
    //     () => {
    //       this.ShowNotification(
    //         'success',
    //         'Eliminado',
    //         'El registro fue eliminado con éxito'
    //       );
    //       this.listOfDataZona = this.listOfDataZona.filter(x => x.id !== data.id);
    //     },
    //     (error) => {

    //       this.ShowNotification(
    //         'error',
    //         'No se pudo eliminar',
    //         'El registro no pudo ser eleminado, por favor revise su conexión a internet o comuníquese con el proveedor.'
    //       );
    //       console.log(error);
    //     }
    //   );
  }

}
