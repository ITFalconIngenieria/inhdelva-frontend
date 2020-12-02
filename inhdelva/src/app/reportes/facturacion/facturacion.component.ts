import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import * as moment from 'moment';
import swal from 'sweetalert';
import { ContratoService } from '../../servicios/contrato.service';

@Component({
  selector: 'app-facturacion',
  templateUrl: './facturacion.component.html',
  styleUrls: ['./facturacion.component.css']
})
export class FacturacionComponent implements OnInit {
  listOfData: any[] = [];
  date = null;

  isVisible = false;
  contratos: any[] = [];
  listOfOption: Array<{ label: string; value: string }> = [];
  fechas = null;
  listOfContratos: any[] = [];

  constructor(
    private reporteService: ReportesService,
    private contratoService: ContratoService
  ) { }

  ngOnInit() {

    this.contratoService.getAllContratos()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfContratos = data;
        }
      );
  }

  onChange(result: Date[]): void {
    // console.log('onChange: ', result);
    // console.log(this.fechas);

  }

  consultar() {

    console.log(this.contratos, this.fechas);

    if (this.contratos.length === 0 || this.fechas === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un contrato y un rango de fechas'
      });
      this.isVisible = false;
    } else {
      this.reporteService.facturacion(
        this.contratos,
        moment(moment(this.fechas[0]).format('YYYY-MM-DD')).toISOString(),
        moment(moment(this.fechas[1]).format('YYYY-MM-DD')).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.isVisible = true;
            console.log(data);
            this.listOfData = data;
          }
        );
    }



  }

}
