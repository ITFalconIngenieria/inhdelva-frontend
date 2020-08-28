import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';

interface Data {
  campo: string;
  lecturaActual: string;
  lecturaAnterior: string;
  consumo: number;
  unidades: string;
}

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  dataSource: any;
  listOfData: Data[] = [
    {
      campo: 'Fecha Lectura',
      lecturaActual: '2019/10/01',
      lecturaAnterior: '2019/11/01',
      consumo: 32000,
      unidades: 'kWh'
    },
    {
      campo: 'Activa',
      lecturaActual: '2019/10/01',
      lecturaAnterior: '2019/11/01',
      consumo: 32000,
      unidades: 'kVArh'
    },
    {
      campo: 'Reactiva',
      lecturaActual: '2019/10/01',
      lecturaAnterior: '2019/11/01',
      consumo: 32000,
      unidades: 'kW'
    },
    {
      campo: 'Demanda',
      lecturaActual: '2019/10/01',
      lecturaAnterior: '2019/11/01',
      consumo: 32000,
      unidades: 'kWh'
    }
  ];

  detallefactura: any;
  periodofactura: any;
  origenElectricidad: any;
  detalleCliente: any;
  maestroFactura: any;
  chartData = [
    {
      label: 'Enero',
      value: '270'
    },
    {
      label: 'Marzo',
      value: '320'
    },
    {
      label: 'Mayo',
      value: '300'
    },
    {
      label: 'Julio',
      value: '310'
    },
    {
      label: 'Septiembre',
      value: '280'
    },
    {
      label: 'Noviembre',
      value: '290'
    }
  ];

  constructor(
    private facturaService: FacturaService
  ) { }

  ngOnInit() {

    this.dataSource = {
      chart: {
        caption: 'Consumo de energia electrica (kWh)', // Set the chart caption
        // subCaption: 'In MMbbl = One Million barrels', //Set the chart subcaption
        //  xAxisName: 'Country', //Set the x-axis name
        //  yAxisName: 'Reserves (MMbbl)', //Set the y-axis name
        //  numberSuffix: 'K',
        theme: 'fusion' // Set the theme for your chart
      },
      // Chart Data - from step 2
      data: this.chartData
    };

    this.facturaService.get()
      .toPromise()
      .then(
        (data: any) => {
          console.log(data);
          this.detallefactura = { ...data[0] };
          this.periodofactura = data[1];
          this.origenElectricidad = data[2];
          this.detalleCliente = data[3];
          this.maestroFactura = data[4];

          console.log(this.detallefactura[0].ActivaActual);


        }
      );

  }

}
