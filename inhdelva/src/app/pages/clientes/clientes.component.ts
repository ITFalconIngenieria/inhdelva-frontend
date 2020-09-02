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
  clienteFiltrado: ClientesModel[] = [];
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

  busquedad() {
    const codigo = this.validateForm.value.Codigo;
    const cliente = this.listOfDataClientes.filter(x => x.Codigo === codigo);
    this.clienteFiltrado = { ...cliente };

    this.validateForm = this.fb.group({
      Codigo: [this.clienteFiltrado[0].Codigo, [Validators.required]],
      RTN: [this.clienteFiltrado[0].RTN, [Validators.required]],
      Nombre: [this.clienteFiltrado[0].Nombre, [Validators.required]],
      Contacto: [this.clienteFiltrado[0].Contacto, [Validators.required]],
      Telefono: [this.clienteFiltrado[0].Telefono, [Validators.required]],
      Email: [this.clienteFiltrado[0].Email, [Validators.required]],
      Direccion: [this.clienteFiltrado[0].Direccion, [Validators.required]],
      Imagen: [this.clienteFiltrado[0].Imagen, [Validators.required]],
      Observacion: [this.clienteFiltrado[0].Observacion, [Validators.required]]
    });

    console.log(this.clienteFiltrado[0].Nombre);

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
      Nombre: [null, [Validators.required]],
      Contacto: [null, [Validators.required]],
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
