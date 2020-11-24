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

  // EtiquetaInh = {
  //   color: '#000000',
  //   'font-size': '13px',
  //   position: 'absolute',
  //   right: 0,
  //   top: '35%'
  // };

  // HRinh = {
  //   height: '2px',
  //   width: '59%',
  //   'background-color': '#F9D32A',
  //   position: 'absolute',
  //   right: 0,
  //   top: '37%'
  // };

  // ValorIhn = {
  //   color: '#000000',
  //   'font-size': '13px',
  //   position: 'absolute',
  //   right: 0,
  //   top: '45%'
  // };



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
  totalMatrizEnergia: number = 0;
  totalMatrizEmisiones: number = 0;

  mediaInhdelva: any;
  mediaProveedores: any;
  EtiquetaInh;
  HRinh;
  ValorIhn;
  emesionesVisible = false;
  // EtiquetaProveedores;
  // HRproveedores;
  // ValorProveedores;

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
          // console.log(data[2]);
          // console.log(data[5]);

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
            this.totalMatrizEnergia += element.Energia;
            this.totalMatrizEmisiones += element.Emisiones;

            this.chatDataMatrizProvee = [{
              label: element.Origen,
              value: Math.round(element.Energia)
            }, ...this.chatDataMatrizProvee];
          });

          console.log(this.matrizEnergetica);

          // totalMatrizEmisiones Seria la media de proveedores
          // (matrisInh[0].Convencional / totalMatrizEnergia ) * this.totalMatrizEmisiones Media inhdelva

          this.mediaInhdelva = ((matrisInh[0].Convencional / this.totalMatrizEnergia) * this.totalMatrizEmisiones).toFixed(3);
          this.mediaProveedores = (this.totalMatrizEmisiones).toFixed(3);

          console.log(matrisInh[0].Convencional, this.totalMatrizEnergia, this.totalMatrizEmisiones);

          console.log(this.mediaInhdelva, this.mediaProveedores);

          if (this.mediaInhdelva >= 0.000 && this.mediaInhdelva < 0.481) {
            this.emesionesVisible = false;
            this.EtiquetaInh = {
              color: 'rgb(0, 0, 0)',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '-5%',
            };

            this.HRinh = {
              height: '2px',
              width: '72%',
              'background-color': 'rgb(94 120 53)',
              position: 'absolute',
              right: 0,
              top: '-3%',
            };

            this.ValorIhn = {
              color: 'rgb(0, 0, 0)',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '5%'
            };

          } else if (this.mediaInhdelva >= 0.481 && this.mediaInhdelva < 0.569) {
            this.emesionesVisible = true;
            this.EtiquetaInh = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '16%'
            };

            this.HRinh = {
              height: '2px',
              width: '69%',
              'background-color': 'rgb(142 178 62)',
              position: 'absolute',
              right: 0,
              top: '17%',
            };

            this.ValorIhn = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '25%'
            };

          } else if (this.mediaInhdelva >= 0.569 && this.mediaInhdelva < 0.635) {
            this.emesionesVisible = true;
            this.EtiquetaInh = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '35%'
            };

            this.HRinh = {
              height: '2px',
              width: ' 59%',
              'background-color': 'rgb(249, 211, 42)',
              position: 'absolute',
              right: 0,
              top: '37%'
            };

            this.ValorIhn = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '45%'
            };

          } else if (this.mediaInhdelva >= 0.635 && this.mediaInhdelva < 0.851) {
            this.emesionesVisible = true;
            this.EtiquetaInh = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '55%'
            };

            this.HRinh = {
              height: '2px',
              width: '54%',
              'background-color': 'rgb(227, 125, 37)',
              position: 'absolute',
              right: 0,
              top: ' 57%',
            };

            this.ValorIhn = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '64%',
            };

          } else if (this.mediaInhdelva >= 0.851) {
            this.emesionesVisible = true;
            this.EtiquetaInh = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '74%'
            };

            this.HRinh = {
              height: '2px',
              width: '49%',
              'background-color': 'rgb(224 94 38)',
              position: 'absolute',
              right: 0,
              top: '76%'
            };

            this.ValorIhn = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '83%'
            };

          }

          // if (this.mediaProveedores >= 0.481 && this.mediaProveedores < 0.569) {

          //   this.EtiquetaProveedores = {
          //     color: '#000000',
          //     'font-size': '13px',
          //     position: 'absolute',
          //     right: 0,
          //     top: '16%'
          //   };

          //   this.HRproveedores = {
          //     height: '2px',
          //     width: '69%',
          //     'background-color': 'rgb(142 178 62)',
          //     position: 'absolute',
          //     right: 0,
          //     top: '17%',
          //   };

          //   this.ValorProveedores = {
          //     color: '#000000',
          //     'font-size': '13px',
          //     position: 'absolute',
          //     right: 0,
          //     top: '25%'
          //   };

          // } else if (this.mediaProveedores >= 0.569 && this.mediaProveedores < 0.635) {

          //   this.EtiquetaProveedores = {
          //     color: '#000000',
          //     'font-size': '13px',
          //     position: 'absolute',
          //     right: 0,
          //     top: '35%'
          //   };

          //   this.HRproveedores = {
          //     height: '2px',
          //     width: ' 59%',
          //     'background-color': 'rgb(249, 211, 42)',
          //     position: 'absolute',
          //     right: 0,
          //     top: '37%'
          //   };

          //   this.ValorProveedores = {
          //     color: '#000000',
          //     'font-size': '13px',
          //     position: 'absolute',
          //     right: 0,
          //     top: '45%'
          //   };

          // } else if (this.mediaProveedores >= 0.635 && this.mediaProveedores < 0.851) {

          //   this.EtiquetaProveedores = {
          //     color: '#000000',
          //     'font-size': '13px',
          //     position: 'absolute',
          //     right: 0,
          //     top: '55%'
          //   };

          //   this.HRproveedores = {
          //     height: '2px',
          //     width: '54%',
          //     'background-color': 'rgb(227, 125, 37)',
          //     position: 'absolute',
          //     right: 0,
          //     top: ' 57%',
          //   };

          //   this.ValorProveedores = {
          //     color: '#000000',
          //     'font-size': '13px',
          //     position: 'absolute',
          //     right: 0,
          //     top: '64%',
          //   };

          // } else if (this.mediaProveedores >= 0.851) {

          //   this.EtiquetaProveedores = {
          //     color: '#000000',
          //     'font-size': '13px',
          //     position: 'absolute',
          //     right: 0,
          //     top: '74%'
          //   };

          //   this.HRproveedores = {
          //     height: '2px',
          //     width: '49%',
          //     'background-color': 'rgb(224 94 38)',
          //     position: 'absolute',
          //     right: 0,
          //     top: '76%'
          //   };

          //   this.ValorProveedores = {
          //     color: '#000000',
          //     'font-size': '13px',
          //     position: 'absolute',
          //     right: 0,
          //     top: '83%'
          //   };

          // }

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
