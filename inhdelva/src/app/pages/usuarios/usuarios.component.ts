import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import swal from 'sweetalert';
import { UsuarioService } from '../../servicios/usuario.service';

interface UsuarioModel {
  id: number;
  Nombre: string;
  Apellido: string;
  Telefono: string;
  idUser: string;
  Observacion: string;
  AD: boolean;
  Estado: boolean;
  Correo?: any;
  TipoUsuario: number;
  usId: string;
  realm?: any;
  username: string;
  email: string;
  emailVerified?: any;
  verificationToken?: any;
  ucId: string;
  password: string;
  userId: string;
}

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
  op;
  listOfDataUsuarios: any[] = [];
  accion: string;
  passwordVisible = false;
  password: string;
  searchValue = '';
  visible = false;
  listOfDisplayData: any[] = [];

  listOfColumn = [
    {
      title: 'Nombre',
      compare: (a: UsuarioModel, b: UsuarioModel) => a.Nombre.localeCompare(b.Nombre),
      priority: 1
    },
    {
      title: 'Apellido',
      compare: (a: any, b: any) => a.Apellido.localeCompare(b.Apellido),
      priority: 2
    },
    {
      title: 'User',
      compare: (a: any, b: any) => a.username.localeCompare(b.username),
      priority: 3
    },
    {
      title: 'Telefono',
      compare: null,
      priority: false
    },
    {
      title: 'D/A',
      compare: null,
      priority: false
    }
  ];

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
    this.validateForm.value.telefono = (this.validateForm.value.telefono === '' || this.validateForm.value.telefono === null) ? 'N/A' : this.validateForm.value.telefono;
    this.validateForm.value.tuser = parseFloat(this.validateForm.value.tuser);

    this.dataUser = {
      ...this.validateForm.value,
      estado: true
    };

    if (this.accion === 'editar') {

      const dataUser = {
        ...this.validateForm.value,
        estado: true,
        usId: this.userEdit
      };

      this.usuarioService.putUsuario(dataUser)
        .toPromise()
        .then(
          (data: any) => {

            this.ShowNotification(
              'success',
              'Guardado con éxito',
              'El registro fue guardado con éxito'
            );

            for (const item of this.listOfDataUsuarios.filter(x => x.usId === this.userEdit)) {
              item.Apellido = data.Apellido;
              item.Estado = data.Estado;
              item.Nombre = data.Nombre;
              item.Observacion = data.Observacion;
              item.Telefono = data.Telefono;
              item.TipoUsuario = data.TipoUsuario;
              item.email = data.email;
              item.password = data.password;
              item.username = data.username;
              item.AD = data.AD;
            }

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
      this.usuarioService.postUsuarioRelacion(this.dataUser)
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

    this.userEdit = data.usId;
    this.validateForm = this.fb.group({
      nombre: [data.Nombre, [Validators.required]],
      apellido: [data.Apellido, [Validators.required]],
      username: [data.username, [Validators.required]],
      email: [data.email, [Validators.email]],
      ad: [data.AD],
      password: [data.password, [Validators.required, Validators.minLength(5)]],
      telefono: [data.Telefono],
      tuser: [(data.TipoUsuario).toString()],
      observacion: [data.Observacion]
    });

  }

  eliminar(data) {
    this.usuarioService.deleteUsuario(data.id, { estado: false })
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
      ad: [true],
      telefono: [null],
      tuser: ['2'],
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

  reset(): void {
    this.searchValue = '';
    this.search();
  }

  search(): void {
    this.visible = false;
    this.listOfDisplayData = this.listOfDataUsuarios.filter((item: any) => (item.Nombre.indexOf(this.searchValue) !== -1) || (item.Apellido.indexOf(this.searchValue) !== -1) || (item.username.indexOf(this.searchValue) !== -1));
  }

  ngOnInit() {
    this.accion = 'new';

    this.usuarioService.getAllUsuarios()
      .toPromise()
      .then(
        (data: any[]) => {
          console.log(data);
          
          this.listOfDataUsuarios = data;
          this.listOfDisplayData = [...this.listOfDataUsuarios];
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
