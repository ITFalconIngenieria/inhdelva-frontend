import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ParametroTarifaModel, TarifaModel } from '../../Modelos/tarifa';
import { TarifaService } from '../../servicios/tarifa.service';

@Component({
  selector: 'app-tipoTarifa',
  templateUrl: './tipoTarifa.component.html',
  styleUrls: ['./tipoTarifa.component.css']
})
export class TipoTarifaComponent implements OnInit {


  expandSet = new Set<number>();
  isVisible = false;
  isVisibleParametro = false;
  validateForm: FormGroup;
  dateFormat = 'yyyy/MM/dd';

  listOfDataTarifa: TarifaModel[] = [];
  listOfDataParametros: ParametroTarifaModel[] = [];
  listOfDataParametrosFiltrado: ParametroTarifaModel[] = [];

  constructor(
    private fb: FormBuilder,
    private tarifaService: TarifaService
  ) { }

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

    this.tarifaService.getTarifas()
      .toPromise()
      .then(
        (data: TarifaModel[]) => this.listOfDataTarifa = data
      );

    this.tarifaService.getTarifasParametro()
      .toPromise()
      .then(
        (data: ParametroTarifaModel[]) => this.listOfDataParametros = data
      );

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

  showModalParametro(data): void {
    this.isVisibleParametro = true;
    this.listOfDataParametrosFiltrado = this.listOfDataParametros.filter(x => x.tarifaId === data.id);
  }

  handleCancelParametro(): void {
    this.isVisibleParametro = false;
  }

  handleOkParametro(): void {
    this.isVisibleParametro = false;
  }

}
