import { UserService } from './../servicios/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import swal from 'sweetalert';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;
  loading: boolean = true;
  formulario: boolean = true;

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private message: NzMessageService,
    private userService: UserService
  ) { }

  submitForm(): void {
    this.formulario = false;
    this.loading = true;
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.userService.validar(this.validateForm.value)
      .toPromise()
      .then(
        (data: any) => {

          this.userService.executeLogin(data);
          this.route.navigate(['inicio']);
          this.createMessage('success', `Bienvenido`);
        },
        (error) => {
          console.log(error);
          swal('Credenciales invalidas', 'Por favor revise sus credenciales', 'error');
          this.validateForm = this.fb.group({
            username: [null, [Validators.required]],
            password: [null, [Validators.required]],
          });
          this.formulario = true;
          this.loading = false;
        }
      );

  }

  ngOnInit(): void {

    this.formulario = true;
    this.loading = false;
    
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  createMessage(type: string, message: string): void {
    this.message.create(type, message);
  }
}
