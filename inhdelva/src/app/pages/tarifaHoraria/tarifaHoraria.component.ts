import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-tarifaHoraria',
  templateUrl: './tarifaHoraria.component.html',
  styleUrls: ['./tarifaHoraria.component.css']
})
export class TarifaHorariaComponent implements OnInit {
  expandSet = new Set<number>();
  isVisible = false;
  isVisibleParametro = false;
  validateForm: FormGroup;
  dateFormat = 'yyyy/MM/dd';

  parserLectura = (value: string) => value.replace('kW ', '');
  formatterLectura = (value: number) => `${value} kW`;

  constructor(
    private fb: FormBuilder
  ) { }

  listOfData = [
    {
      id: 1,
      name: 'John Brown',
      age: 32,
      expand: false,
      address: 'New York No. 1 Lake Park',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'Jim Green',
      age: 42,
      expand: false,
      address: 'London No. 1 Lake Park',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'Joe Black',
      age: 32,
      expand: false,
      address: 'Sidney No. 1 Lake Park',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    }
  ];

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
