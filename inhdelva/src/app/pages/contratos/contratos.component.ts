import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleMedidor = false;
  validateForm: FormGroup;
  dateFormat = 'yyyy/MM/dd';

  constructor(
    private fb: FormBuilder
  ) { }

  listOfData = [
    {
      id: 1,
      name: 'Cliente XXXX',
      age: 32,
      expand: '##/##/####',
      address: 'SBX',
      description: 'Contrato cliente ###'
    },
    {
      id: 2,
      name: 'Cliente XXXX',
      age: 42,
      expand: '##/##/####',
      address: 'SBX',
      description: 'Contrato cliente ###'
    },
    {
      id: 3,
      name: 'Cliente XXXX',
      age: 32,
      expand: '##/##/####',
      address: 'SBX',
      description: 'Contrato cliente ###'
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

  showModalMedidor(): void {
    this.isVisibleMedidor = true;
  }

  handleCancelMedidor(): void {
    this.isVisibleMedidor = false;
  }

  handleOkMedidor(): void {
    this.isVisibleMedidor = false;
  }

}
