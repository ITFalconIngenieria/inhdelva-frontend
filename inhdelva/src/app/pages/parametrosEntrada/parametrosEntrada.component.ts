import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-parametrosEntrada',
  templateUrl: './parametrosEntrada.component.html',
  styleUrls: ['./parametrosEntrada.component.css']
})
export class ParametrosEntradaComponent implements OnInit {
  
  constructor(
    private fb: FormBuilder
  ) { }
  expandSet = new Set<number>();
  isVisible = false;
  validateForm: FormGroup;
  dateFormat = 'yyyy/MM/dd';

  listOfData = [
    {
      id: 1,
      name: 'Perdidas de Transformacion',
      age: 32,
      expand: false,
      address: '##/##/####',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'Perdidas de Transformacion',
      age: 42,
      expand: false,
      address: '##/##/####',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'Perdidas de Transformacion',
      age: 32,
      expand: false,
      address: '##/##/####',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
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

}
