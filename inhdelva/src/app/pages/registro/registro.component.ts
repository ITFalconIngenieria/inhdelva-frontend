import { UsuarioService } from './../../servicios/usuario.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

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

    // debugger;
    this.dataUsuarios = {
      ...this.validateForm.value,
      ad: 1,
      estado: 1
    };

    console.log(this.dataUsuarios);


    this.usuarioService.postUsuarios(this.dataUsuarios)
      .toPromise()
      .then(
        (data) => {

          this.validateForm = this.fb.group({
            nombre: [null, [Validators.required]],
            apellido: [null, [Validators.required]],
            username: [null, [Validators.required]],
            email: [null, [Validators.email, Validators.required]],
            password: [null, [Validators.required]],
            telefono: [null, [Validators.required]],
            observacion: [null]
          });
          this.createMessage('success', 'Usuario creado con exito');

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
      telefono: [null, [Validators.required]],
      observacion: [null]
    });
  }

}
