import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tipoTarifa',
  templateUrl: './tipoTarifa.component.html',
  styleUrls: ['./tipoTarifa.component.css']
})
export class TipoTarifaComponent implements OnInit {

  constructor(
    private fb: FormBuilder
  ) { }

  expandSet = new Set<number>();
  isVisible = false;
  isVisibleParametro = false;
  validateForm: FormGroup;
  dateFormat = 'yyyy/MM/dd';

  listOfData = [
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'MATRIZ X',
      description: 'Tarifa monomica para servicio de XXXX Tension'
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'MATRIZ X',
      description: 'Tarifa monomica para servicio de XXXX Tension'
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'MATRIZ X',
      description: 'Tarifa monomica para servicio de XXXX Tension'
    }
  ];


  parserLectura = (value: string) => value.replace('kW ', '');
  formatterLectura = (value: number) => `kW ${value}`;

  onExpandChange(id: number, checked: boolean): void {
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

  ngOnInit() {

    this.validateForm = this.fb.group({
      Codigo: [null, [Validators.required]],
      Descripcion: [null, [Validators.required]],
      Serie: [null, [Validators.required]],
      Modelo: [null, [Validators.required]],
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

  showModalParametro(): void {
    this.isVisibleParametro = true;
  }

  handleCancelParametro(): void {
    this.isVisibleParametro = false;
  }

  handleOkParametro(): void {
    this.isVisibleParametro = false;
  }

}
