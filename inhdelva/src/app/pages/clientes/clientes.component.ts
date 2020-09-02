import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientesModel } from '../../Modelos/actores';
import { ActoresService } from '../../servicios/actores.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  isVisible = false;
  validateForm: FormGroup;

  listOfDataClientes: ClientesModel[] = [];
  constructor(
    private fb: FormBuilder,
    private actoresService: ActoresService
  ) { }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  busquedad(){
    
  }

  ngOnInit() {

    this.actoresService.getClientes()
      .toPromise()
      .then(
        (data: any[]) => {
          console.log(data);

          this.listOfDataClientes = data;
        }
      );

    this.validateForm = this.fb.group({
      Codigo: [null, [Validators.required]],
      RTN: [null, [Validators.required]],
      RepresentanteLegal: [null, [Validators.required]],
      NombreContacto: [null, [Validators.required]],
      Telefono: [null, [Validators.required]],
      Email: [null, [Validators.required]],
      Direccion: [null, [Validators.required]],
      Imagen: [null, [Validators.required]],
      Observacion: [null, [Validators.required]]
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  handleOk(): void {
    this.isVisible = false;
  }

}
