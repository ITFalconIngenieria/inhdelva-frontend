import { EncabezadoFactura, BloquesdeEnergia, DetalleFactura } from './../../Modelos/factura';
import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
moment.locale('es');

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  EtiquetaProveedores = {
    color: '#000000',
    'font-size': '13px',
    position: 'absolute',
    right: 0,
    top: '55%'
  };

  HRproveedores = {
    height: '2px',
    width: '54%',
    'background-color': '#E37D25',
    position: 'absolute',
    right: 0,
    top: '57%'
  };

  ValorProveedores = {
    color: '#000000',
    'font-size': '13px',
    position: 'absolute',
    right: 0,
    top: '64%'
  };

  EtiquetaInh = {
    color: '#000000',
    'font-size': '13px',
    position: 'absolute',
    right: 0,
    top: '35%'
  };

  HRinh = {
    height: '2px',
    width: '59%',
    'background-color': '#F9D32A',
    position: 'absolute',
    right: 0,
    top: '37%'
  };

  ValorIhn = {
    color: '#000000',
    'font-size': '13px',
    position: 'absolute',
    right: 0,
    top: '45%'
  };



  dataSourceConsumo: any;
  chartDataConsumo: any[] = [];
  dataSourceMatrizProveedores;
  chatDataMatrizProvee: any[] = [];
  dataSourceMatrizInh: any;
  chatDataMatrizInh: any[] = [];

  clienteReguladoData: any[] = [];

  totalConsumo: number = 0;
  totalApagar: number = 0;
  energiaReactiva: number = 0;
  resultadoFactorP: number = 0;
  resultadoPenalidad: number = 0;
  dataFactura;
  cargado: boolean;
  pag;
  EncabezadoFacturaData: EncabezadoFactura = new EncabezadoFactura();
  BloquesdeEnergiaFactura: BloquesdeEnergia[] = [];
  DetalleFacturaData: DetalleFactura = new DetalleFactura();
  factorRecargo: number;
  matrizEnergetica: any[] = [];
  totalMatriz: number = 0;

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.dataFactura = this.router.getCurrentNavigation().extras.state || this.facturaService.getInfoNavegacion();
  }

  volver() {

    if (this.pag === 'G') {
      this.facturaService.destroyInfo();
      this.router.navigate(['facturasGeneradas']);
    } else {
      this.facturaService.destroyInfo();
      this.router.navigate(['facturasCanceladas']);
    }

  }

  ngOnInit() {
    this.cargado = false;
    this.spinner.show();
    this.dataFactura = this.facturaService.getInfoNavegacion();
    console.log(this.dataFactura);

    const { id, contratoid, fechaInicio, medidorId, fechaLectura, fechaFin } = this.dataFactura;
    this.pag = this.dataFactura.pag;

    this.facturaService.getDetalleFactura(
      id,
      `${moment(fechaInicio).subtract(12, 'month').format('YYYY-MM-DD')}T00:00:00.000Z`,
      `${moment(fechaInicio).add(1, 'day').format('YYYY-MM-DD')}T00:00:00.000Z`,
      `${moment(fechaInicio).format('YYYY-MM-DD')}T00:00:00.000Z`,
      `${moment(fechaFin).format('YYYY-MM-DD')}T06:00:00.000Z`,
      contratoid,
      medidorId
    )
      .toPromise()
      .then(
        (data: any) => {
          this.EncabezadoFacturaData = { ...data[0] };
          this.BloquesdeEnergiaFactura = data[1];
          this.DetalleFacturaData = { ...data[2] };
          console.log(data[2]);
          console.log(data[5]);

          const matrisInh = data[5];

          this.chatDataMatrizInh = [
            {
              label: 'Fracción energía concencional',
              value: Math.round(matrisInh[0].Convencional * 100) / 100
            },
            {
              label: 'Fracción energía solar fotovoltaica',
              value: Math.round(matrisInh[1].Solar * 100) / 100
            }
          ];

          this.dataSourceMatrizInh = {
            chart: {
              caption: 'Matriz energética de INHDELVA', // Set the chart caption
              valuePosition: 'inside',
              palettecolors: '0E9679,F3931F',
              showLabels: '0',
              theme: 'fusion' // Set the theme for your chart
            },
            data: this.chatDataMatrizInh
          };

          this.matrizEnergetica = data[4].reduce((acumulador, valorActual) => {
            const elementoYaExiste = acumulador.find(elemento => elemento.Id === valorActual.Id);
            if (elementoYaExiste) {
              return acumulador.map((elemento) => {
                if (elemento.Id === valorActual.Id) {
                  return {
                    ...elemento,
                    Energia: elemento.Energia + valorActual.Energia
                  };
                }
                return elemento;
              });
            }
            return [...acumulador, valorActual];
          }, []);

          this.matrizEnergetica.forEach(element => {
            this.totalMatriz += element.Energia;
            this.chatDataMatrizProvee = [{
              label: element.Origen,
              value: Math.round(element.Energia)
            }, ...this.chatDataMatrizProvee];
          });

          this.dataSourceMatrizProveedores = {
            chart: {
              caption: 'Matriz energética de Proveedoes', // Set the chart caption
              valuePosition: 'inside',
              showLabels: '0',
              decimals: '0',
              palettecolors: '8BB53A,0E9679,2CB8C5,F2921F,929133,7E5025,E65124,4D4E4D,1D1D1B',
              theme: 'fusion' // Set the theme for your chart
            },
            data: this.chatDataMatrizProvee
          };

          const consumoHistorico: any[] = data[3];
          // tslint:disable-next-line: prefer-for-of
          for (let x = 0; x < consumoHistorico.length; x++) {
            this.chartDataConsumo = [{
              label: moment(consumoHistorico[x].Fecha).format('MMMM'),
              value: consumoHistorico[x].Energia
            }, ...this.chartDataConsumo];

          }
          this.dataSourceConsumo = {
            chart: {
              caption: 'Consumo de energia electrica (kWh)', // Set the chart caption
              rotateLabels: '0',
              labelDisplay: 'rotate',
              palettecolors: '334d7c,b9b9b9',
              theme: 'fusion' // Set the theme for your chart
            },
            data: this.chartDataConsumo
          };

          this.BloquesdeEnergiaFactura.forEach(x => {
            this.totalConsumo += x.valor;
          });

          this.energiaReactiva = this.DetalleFacturaData[3].valor - this.DetalleFacturaData[4].valor;
          this.totalApagar = this.DetalleFacturaData[27].valor + this.DetalleFacturaData[11].valor;

          this.resultadoFactorP = this.totalConsumo / (Math.sqrt(Math.pow(this.totalConsumo, 2) + Math.pow(this.energiaReactiva, 2)));
          this.factorRecargo = (this.resultadoFactorP >= 0.9) ? 0 : ((0.9 / this.resultadoFactorP) - 1);

          this.resultadoPenalidad = this.factorRecargo * (this.DetalleFacturaData[12].valor + this.DetalleFacturaData[11].valor);

          for (let x = 12; x < 27; x++) {
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
