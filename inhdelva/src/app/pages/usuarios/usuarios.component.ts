import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';
import { UsuarioService } from '../../servicios/usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  expandSet = new Set<any>();
  isVisible = false;
  validateForm: FormGroup;
  radioValue = 'A';
  userEdit;
  dataUser;
  listOfDataUsuarios: any[] = [];
  accion: string;
  passwordVisible = false;
  password: string;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private usuarioService: UsuarioService
  ) { }

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

    this.dataUser = {
      ...this.validateForm.value,
      estado: true
    };

    if (this.accion === 'editar') {
      this.usuarioService.putUsuarios(this.userEdit, this.dataUser)
        .toPromise()
        .then(
          () => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            for (const item of this.listOfDataUsuarios.filter(x => x.id === this.userEdit)) {
              item.codigo = this.dataUser.codigo;
              item.descripcion = this.dataUser.descripcion;
              item.observacion = this.dataUser.observacion;
              item.estado = this.dataUser.estado;
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
            this.limpiar();
            this.accion = 'new';

          }
        );
    } else {
      this.usuarioService.postUsuarios(this.dataUser)
        .toPromise()
        .then(
          (data: any) => {
            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );
            this.listOfDataUsuarios = [...this.listOfDataUsuarios, data];
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

    this.userEdit = data.id;
    this.validateForm = this.fb.group({
      nombre: [data.nombre, [Validators.required]],
      apellido: [data.apellido, [Validators.required]],
      username: [data.username, [Validators.required]],
      email: [data.email, [Validators.email]],
      ad: [data.ad],
      password: [data.password, [Validators.required, Validators.minLength(5)]],
      telefono: [data.telefono],
      observacion: [data.observacion]
    });

  }

  eliminar(data) {
    this.usuarioService.deleteUsuarios(data.id, { estado: false })
      .toPromise()
      .then(
        () => {
          this.ShowNotification(
            'success',
            'Eliminado',
            'El registro fue eliminado con éxito'
          );
          this.listOfDataUsuarios = this.listOfDataUsuarios.filter(x => x.id !== data.id);
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
      nombre: [null, [Validators.required]],
      apellido: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null, [Validators.email]],
      password: [null, [Validators.required, Validators.minLength(5)]],
      ad: [true, [Validators.email]],
      telefono: [null],
      observacion: [null]
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

    this.usuarioService.getUsuarios()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfDataUsuarios = data;
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
