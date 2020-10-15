import { UserService } from './../servicios/user.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  validateForm!: FormGroup;

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }

    this.userService.validar(this.validateForm.value)
      .toPromise()
      .then(
        (data: any) => {
          localStorage.setItem('token', data.token);

          console.log(data);

          this.route.navigate(['inicio']);
        }
      );

  }

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private userService: UserService
  ) { }

  // {
  //   "username": "string",
  //   "password": "string",
  //   "email": "string,"
  //   "nombre": "string",
  //   "apellido": "string",
  //   "telefono": "string",
  //   "observacion": "string",
  //   "ad": bit(1 o 0),
  //   "estado": bit(1 o 0)
  // }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }
}
