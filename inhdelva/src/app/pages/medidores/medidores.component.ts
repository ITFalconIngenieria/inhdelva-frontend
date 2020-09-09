import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-medidores',
  templateUrl: './medidores.component.html',
  styleUrls: ['./medidores.component.css']
})
export class MedidoresComponent implements OnInit {
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleRollover = false;
  validateForm: FormGroup;
  dateFormat = 'yyyy/MM/dd';
  codigo: string;
  descripcion: string;
  serie: string;
  modelo: string;
  direccionIp: string;
  lecMax: number;
  observacion: string;

  constructor(
    private fb: FormBuilder
  ) { }

  listOfData = [
    {
      id: 1,
      name: 'Scheneider Electric',
      age: 32,
      expand: false,
      address: '##########',
      description: 'Aqui va una descripcion'
    },
    {
      id: 2,
      name: 'Scheneider Electric',
      age: 42,
      expand: false,
      address: '##########',
      description: 'Aqui va una descripcion'
    },
    {
      id: 3,
      name: 'Scheneider Electric',
      age: 32,
      expand: false,
      address: '##########',
      description: 'Aqui va una descripcion'
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

  showModalRollover(): void {
    this.isVisibleRollover = true;
  }

  handleCancelRollover(): void {
    this.isVisibleRollover = false;
  }

  handleOkRollover(): void {
    this.isVisibleRollover = false;
  }

}
