import { CargosEspecialesService } from './../../servicios/cargosEspeciales.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-cargosEspeciales',
  templateUrl: './cargosEspeciales.component.html',
  styleUrls: ['./cargosEspeciales.component.css']
})
export class CargosEspecialesComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private cargoService: CargosEspecialesService
  ) { }
  expandSet = new Set<number>();
  isVisible = false;
  validateForm: FormGroup;
  demoValue = 100;
  radioValue = 'A';
  dateFormat = 'yyyy/MM/dd';

  listOfData: any[] = [];

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

    this.cargoService.getCargosEspeciales()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfData = data;
        }
      );

    this.validateForm = this.fb.group({
      fechaInicial: [null, [Validators.required]],
      financiamiento: [0],
      rectificacion: [0],
      corte: [0],
      mora: [0],
      otros: [0],
      observacion: [null, [Validators.required]]
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
