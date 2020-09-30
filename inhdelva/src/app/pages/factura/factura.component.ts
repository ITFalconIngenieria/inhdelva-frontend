import { EncabezadoFactura, BloquesdeEnergia, DetalleFactura } from './../../Modelos/factura';
import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';

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
  totalConsumo: number = 0;
  totalApagar: number = 0;
  energiaReactiva: number = 0;
  resultadoFactorP: number = 0;
  resultadoPenalidad: number = 0;
  dataFactura;
  cargado: boolean;
  EncabezadoFacturaData: EncabezadoFactura = new EncabezadoFactura();
  BloquesdeEnergiaFactura: BloquesdeEnergia[] = [];
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
    private facturaService: FacturaService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.dataFactura = this.router.getCurrentNavigation().extras.state || this.facturaService.getInfoNavegacion();
  }

  ngOnInit() {
    this.cargado = false;
    this.spinner.show();
    this.dataFactura = this.facturaService.getInfoNavegacion();
    console.log(this.dataFactura);

    const { id } = this.dataFactura;
    console.log(id);

    this.dataSourceBarra = {
      chart: {
        caption: 'Consumo de energia electrica (kWh)', // Set the chart caption
        rotateLabels: '0',
        labelDisplay: 'rotate',
        palettecolors: '334d7c,b9b9b9',
        theme: 'fusion' // Set the theme for your chart
      },
      data: this.chartDataBarra
    };

    this.dataSourcePastelINH = {
      chart: {
        caption: 'Matriz energética de INHDELVA', // Set the chart caption
        valuePosition: 'inside',
        palettecolors: '0E9679,F3931F',
        showLabels: '0',
        theme: 'fusion' // Set the theme for your chart
      },
      data: this.chartDataPstelINH
    };

    this.dataSourcePastelHN = {
      chart: {
        caption: 'Matriz energética de INHDELVA', // Set the chart caption
        valuePosition: 'inside',
        showLabels: '0',
        palettecolors: '8BB53A,0E9679,2CB8C5,F2921F,929133,7E5025,E65124,4D4E4D,1D1D1B',
        theme: 'fusion' // Set the theme for your chart
      },
      data: this.chartDataPstelHN
    };

    this.facturaService.getDetalleFactura(id)
      .toPromise()
      .then(
        (data: any) => {
          this.EncabezadoFacturaData = { ...data[0] };
          this.BloquesdeEnergiaFactura = data[1];
          this.DetalleFacturaData = { ...data[2] };

          this.BloquesdeEnergiaFactura.forEach(x => {
            this.totalConsumo += x.valor;
          });

          this.energiaReactiva = this.DetalleFacturaData[3].valor - this.DetalleFacturaData[4].valor;
          this.totalApagar = this.DetalleFacturaData[28].valor + this.DetalleFacturaData[11].valor;

          this.resultadoFactorP = this.totalConsumo / (Math.sqrt(Math.pow(this.totalConsumo, 2) + Math.pow(this.energiaReactiva, 2)));
          console.log(this.resultadoFactorP);

          this.resultadoPenalidad = this.DetalleFacturaData[12].valor + this.DetalleFacturaData[11].valor;
          for (let x = 13; x < 28; x++) {
            this.clienteReguladoData.push(this.DetalleFacturaData[x]);
          }
          this.cargado = true;
          this.spinner.hide();
        },
        (error) => {

          swal({
            icon: 'error',
            title: 'No se pudo conectar al servidor',
            text: 'Revise su conexión a internet o comuníquese con el proveedor.'
          });

          console.log(error);
        }
      );

  }



}
