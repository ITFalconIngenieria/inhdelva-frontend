import { LocalizacionModel } from './../../Modelos/localizacion';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalizacionService } from '../../servicios/localizacion.service';

@Component({
  selector: 'app-localizacion',
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.css']
})
export class LocalizacionComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private localizacionService: LocalizacionService

  ) { }

  expandSet = new Set<any>();
  isVisible = false;
  validateForm: FormGroup;
  demoValue = 100;
  radioValue = 'A';

  listOfDataLocalizacion: LocalizacionModel[] = [];

  parserArea = (value: string) => value.replace(' m²', '');
  formatterArea = (value: number) => `${value} m²`;

  onExpandChange(Codigo: any, checked: boolean): void {
    if (checked) {
      this.expandSet.add(Codigo);
    } else {
      this.expandSet.delete(Codigo);
    }
  }

  submitForm(): void {
    // tslint:disable-next-line: forin
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
  }

  ngOnInit() {

    this.localizacionService.getLocalizacion()
      .toPromise()
      .then(
        (data: LocalizacionModel[]) => {
          this.listOfDataLocalizacion = data;
        }
      );

    this.validateForm = this.fb.group({
      Codigo: [null, [Validators.required]],
      Descripcion: [null, [Validators.required]],
      ZonaId: [null, [Validators.required]],
      Area: [0, [Validators.required]],
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

  editar(id) {
    this.isVisible = true;
    console.log(id);

  }
}
