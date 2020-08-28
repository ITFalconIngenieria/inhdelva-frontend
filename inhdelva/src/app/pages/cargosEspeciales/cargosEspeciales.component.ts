import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cargosEspeciales',
  templateUrl: './cargosEspeciales.component.html',
  styleUrls: ['./cargosEspeciales.component.css']
})
export class CargosEspecialesComponent implements OnInit {

  constructor(
    private fb: FormBuilder

  ) { }
  expandSet = new Set<number>();
  isVisible = false;
  validateForm: FormGroup;
  demoValue = 100;
  radioValue = 'A';

  listOfData = [
    {
      id: 1,
      name: 'XXXXXXX',
      age: 32,
      expand: false,
      address: '##/##/####',
      description: 'My name is John Brown, I am 32 years old, living in New York No. 1 Lake Park.'
    },
    {
      id: 2,
      name: 'XXXXXXX',
      age: 42,
      expand: false,
      address: '##/##/####',
      description: 'My name is Jim Green, I am 42 years old, living in London No. 1 Lake Park.'
    },
    {
      id: 3,
      name: 'XXXXXXX',
      age: 32,
      expand: false,
      address: '##/##/####',
      description: 'My name is Joe Black, I am 32 years old, living in Sidney No. 1 Lake Park.'
    }
  ];
  parserArea = (value: string) => value.replace(' m²', '');
  formatterArea = (value: number) => `${value} m²`;

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
