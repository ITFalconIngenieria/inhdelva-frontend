import { UsuarioService } from './../../servicios/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import swal from 'sweetalert';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss']
})
export class RegistroComponent implements OnInit {
  validateForm: FormGroup;
  passwordVisible = false;
  password: string;
  dataUsuarios;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioService,
    private message: NzMessageService
  ) { }

  createMessage(type: string, mensaje: string): void {
    this.message.create(type, mensaje);
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.validateForm.value.observacion = (this.validateForm.value.observacion === '' || this.validateForm.value.observacion === null) ? 'N/A' : this.validateForm.value.observacion;

    this.dataUsuarios = {
      ...this.validateForm.value,
      ad: 0,
      // tuser: 0,
      estado: 1
    };

    console.log(this.dataUsuarios);


    this.usuarioService.postUsuario(this.dataUsuarios)
      .toPromise()
      .then(
        (data: any) => {
          console.log(data);

          if (data.info) {
            swal({
              icon: 'warning',
              title: `${data.info.message}`,
              text: 'Ya existe un usuario con ese correo'
            });
            
          } else {
            this.validateForm = this.fb.group({
              nombre: [null, [Validators.required]],
              apellido: [null, [Validators.required]],
              username: [null, [Validators.required]],
              email: [null, [Validators.email]],
              password: [null, [Validators.required, Validators.minLength(5)]],
              telefono: [null],
              observacion: [null]
            });
            this.createMessage('success', 'Usuario creado con exito');
          }

        },
        (error) => {
          console.log(error);
          this.createMessage('error', 'No se pudo crear el usuario');

          // this.createMessage('error', 'Opps!!! Algo salio mal');
        }
      );

  }

  ngOnInit() {

    this.validateForm = this.fb.group({
      nombre: [null, [Validators.required]],
      apellido: [null, [Validators.required]],
      username: [null, [Validators.required]],
      email: [null, [Validators.email, Validators.required]],
      password: [null, [Validators.required]],
      telefono: [null],
      observacion: [null]
    });
  }

}
