import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import { ActoresService } from '../../servicios/actores.service';
import * as moment from 'moment';
import swal from 'sweetalert';

@Component({
  selector: 'app-proveedoresEnergia',
  templateUrl: './proveedoresEnergia.component.html',
  styleUrls: ['./proveedoresEnergia.component.scss']
})
export class ProveedoresEnergiaComponent implements OnInit {
  listOfData: any[] = [];
  date = null;

  isVisible = false;
  proveedores: any[] = [];
  fechas = null;
  listOfProveedores: any[] = [];

  constructor(
    private reporteService: ReportesService,
    private proveedoresService: ActoresService
  ) { }

  ngOnInit() {

    this.proveedoresService.getProveedores()
      .toPromise()
      .then(
        (data: any[]) => {
          console.log(data);
          this.listOfProveedores = data;
        }
      );

  }

  onChange(result: Date[]): void {
    // console.log('onChange: ', result);
    // console.log(this.fechas);

  }

  consultar() {

    console.log(this.proveedores, this.fechas);

    if (this.proveedores.length === 0 || this.fechas === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un proveedor y un rango de fechas'
      });
      this.isVisible = false;
    } else {
      this.reporteService.proveedoresEnergia(
        this.proveedores,
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
