import { EncabezadoFactura, BloquesdeEnergia, DetalleFactura } from './../../Modelos/factura';
import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  dataSourceBarra: any;
  dataSourcePastelINH: any;
  dataSourcePastelHN: any;

  clienteReguladoData: any[] = [];

  EncabezadoFacturaData: EncabezadoFactura = new EncabezadoFactura();
  BloquesdeEnergiaFactura: BloquesdeEnergia;
  DetalleFacturaData: DetalleFactura = new DetalleFactura();

  chartDataPstelINH = [
    {
      label: 'Fracción energía concencional',
      value: '70'
    },
    {
      label: 'Fracción energía solar fotovoltaica',
      value: '30'
    }
  ];

  chartDataBarra = [
    {
      label: 'Enero',
      value: '270'
    },
    {
      label: 'Febrero',
      value: '285'
    },
    {
      label: 'Marzo',
      value: '320'
    },
    {
      label: 'Abril',
      value: '312'
    },
    {
      label: 'Mayo',
      value: '300'
    },
    {
      label: 'Junio',
      value: '290'
    },
    {
      label: 'Julio',
      value: '310'
    },
    {
      label: 'Agosto',
      value: '300'
    },
    {
      label: 'Septiembre',
      value: '280'
    }, {
      label: 'Octubre',
      value: '293'
    },
    {
      label: 'Noviembre',
      value: '298'
    },
    {
      label: 'Diciembre',
      value: '325'
    },
  ];

  chartDataPstelHN = [
    {
      label: 'Hidro embalse',
      value: '20'
    },
    {
      label: 'Hidro pasada',
      value: '15'
    },
    {
      label: 'Eólica',
      value: '8'
    },
    {
      label: 'Solar',
      value: '15'
    },
    {
      label: 'Biogás',
      value: '8'
    },
    {
      label: 'Diesél',
      value: '10'
    },
    {
      label: 'Bunker',
      value: '9'
    },
    {
      label: 'Carbón',
      value: '9'
    },
    {
      label: 'Gás',
      value: '19'
    }
  ];

  constructor(
    private facturaService: FacturaService
  ) { }

  ngOnInit() {

    this.dataSourceBarra = {
      chart: {
        caption: 'Consumo de energia electrica (kWh)', // Set the chart caption
        // subCaption: 'In MMbbl = One Million barrels', //Set the chart subcaption
        //  xAxisName: 'Country', //Set the x-axis name
        //  yAxisName: 'Reserves (MMbbl)', //Set the y-axis name
        //  numberSuffix: 'K',
        rotateLabels: '0',
        labelDisplay: 'rotate',
        // labelDisplay: 'Auto',
        // useEllipsesWhenOverflow: '0',
        palettecolors: '334d7c,b9b9b9',
        theme: 'fusion' // Set the theme for your chart
      },
      // Chart Data - from step 2
      data: this.chartDataBarra
    };

    this.dataSourcePastelINH = {
      chart: {
        caption: 'Matriz energética de INHDELVA', // Set the chart caption
        // subCaption: 'In MMbbl = One Million barrels', //Set the chart subcaption
        //  xAxisName: 'Country', //Set the x-axis name
        //  yAxisName: 'Reserves (MMbbl)', //Set the y-axis name
        //  numberSuffix: 'K',
        valuePosition: 'inside',
        palettecolors: '0E9679,F3931F',
        showLabels: '0',
        theme: 'fusion' // Set the theme for your chart
      },
      // Chart Data - from step 2
      data: this.chartDataPstelINH
    };

    this.dataSourcePastelHN = {
      chart: {
        caption: 'Matriz energética de INHDELVA', // Set the chart caption
        // subCaption: 'In MMbbl = One Million barrels', //Set the chart subcaption
        //  xAxisName: 'Country', //Set the x-axis name
        //  yAxisName: 'Reserves (MMbbl)', //Set the y-axis name
        //  numberSuffix: 'K',
        valuePosition: 'inside',
        showLabels: '0',
        palettecolors: '8BB53A,0E9679,2CB8C5,F2921F,929133,7E5025,E65124,4D4E4D,1D1D1B',
        theme: 'fusion' // Set the theme for your chart
      },
      // Chart Data - from step 2
      data: this.chartDataPstelHN
    };

    this.facturaService.getDetalleFactura()
      .toPromise()
      .then(
        (data: any) => {
          this.EncabezadoFacturaData = { ...data[0] };
          this.BloquesdeEnergiaFactura = data[1];
          this.DetalleFacturaData = { ...data[2] };

          for (let x = 13; x < 28; x++) {
            this.clienteReguladoData.push(this.DetalleFacturaData[x]);
          }

          console.log(this.clienteReguladoData);

          console.log(this.DetalleFacturaData);


        }
      );

  }

}
