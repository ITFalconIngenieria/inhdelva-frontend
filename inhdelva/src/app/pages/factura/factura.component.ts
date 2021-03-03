import { EncabezadoFactura, BloquesdeEnergia, DetalleFactura } from './../../Modelos/factura';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FacturaService } from '../../servicios/factura.service';
import { Router } from '@angular/router';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';
import * as moment from 'moment';
moment.locale('es');

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css']
})
export class FacturaComponent implements OnInit {

  @ViewChild('content', { 'static': true }) content: ElementRef;
  @ViewChild('anexo', { 'static': true }) anexo: ElementRef;

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
  diferencia;
  EncabezadoFacturaData: any;
  BloquesdeEnergiaFactura: any[] = [];
  DetalleFacturaData: any[] = [];
  factorRecargo: number;
  matrizEnergetica: any[] = [];
  anexoMedidores: any[] = [];
  isVisibleAnexo: boolean;
  totalMatrizEnergia: number = 0;
  totalMatrizEmisiones: number = 0;
  calculoEXE: number = 0;
  mediaInhdelva: any;
  mediaProveedores: any;
  EtiquetaInh;
  HRinh;
  ValorIhn;
  penalidad: number;
  emesionesVisible = false;
  EtiquetaProveedores;
  HRproveedores;
  ValorProveedores;

  constructor(
    private facturaService: FacturaService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.dataFactura = this.router.getCurrentNavigation().extras.state || this.facturaService.getInfoNavegacion();
  }

  volver() {
    switch (this.pag) {
      case 'G': {
        this.facturaService.destroyInfo();
        this.router.navigate(['facturasGeneradas']);
      }
        break;
      case 'C':{
        this.facturaService.destroyInfo();
        this.router.navigate(['facturasCanceladas']);
      }
        break;
      case 'E':{
        this.facturaService.destroyInfo();
        this.router.navigate(['facturasEmitidas']);
      }
        break;
      default:
        break;
    }

  }

  ngOnInit() {
    this.cargado = false;
    this.isVisibleAnexo = false;
    this.spinner.show();
    this.dataFactura = this.facturaService.getInfoNavegacion();
    console.log(this.dataFactura);

    const { id, contratoid, fechaInicio, medidorId, fechaLectura, fechaFin } = this.dataFactura;
    this.pag = this.dataFactura.pag;

    this.facturaService.getDetalleFactura(
      id,
      `${moment(fechaInicio).subtract(12, 'month').format('YYYY-MM-DD')}T00:00:00.000Z`,
      `${moment(fechaInicio).add(1, 'day').format('YYYY-MM-DD')}T00:00:00.000Z`,
      `${moment(fechaInicio).format('YYYY-MM-DD')}T06:00:00.000Z`,
      `${moment(fechaFin).format('YYYY-MM-DD')}T06:00:00.000Z`,
      contratoid,
      medidorId
    )
      .toPromise()
      .then(
        (data: any) => {
          console.log(data);

          this.EncabezadoFacturaData = { ...data[0] };
          this.BloquesdeEnergiaFactura = data[1];
          this.DetalleFacturaData = { ...data[2] };
          this.anexoMedidores = data[6]
          this.isVisibleAnexo = (this.anexoMedidores.length > 0) ? true : false;

          let fecha1 = moment(this.EncabezadoFacturaData.fechaInicio);
          let fecha2 = moment(this.EncabezadoFacturaData.fechaFin);
          this.diferencia = fecha2.diff(fecha1, 'days');

          const matrisInh = data[5];
          let sumaEnergias = matrisInh[0].Convencional + matrisInh[1].Solar;
          let porcentajeConvecional = matrisInh[0].Convencional / sumaEnergias;

          this.chatDataMatrizInh = [
            {
              label: 'Fracción energía convencional',
              value: matrisInh[0].Convencional
            },
            {
              label: 'Fracción energía solar fotovoltaica',
              value: matrisInh[1].Solar
            }
          ];

          this.dataSourceMatrizInh = {
            chart: {
              caption: 'Matriz energética de INHDELVA', // Set the chart caption
              valuePosition: 'inside',
              palettecolors: '0E9679,F3931F',
              showLabels: '0',
              formatNumberScale: 0,
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
            //this.totalMatrizEmisiones += element.Emisiones;
            this.calculoEXE += (element.Energia * element.Emisiones)

            this.chatDataMatrizProvee = [{
              label: element.Origen,
              value: Math.round(element.Energia)
            }, ...this.chatDataMatrizProvee];
          });
          this.totalMatrizEmisiones += Math.round(this.calculoEXE / this.totalMatrizEnergia * 100) / 100;
          this.mediaProveedores = Math.round(this.calculoEXE / this.totalMatrizEnergia * 100) / 100;
          this.mediaInhdelva = Math.round(porcentajeConvecional * this.mediaProveedores * 100) / 100;

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

          if (this.mediaProveedores >= 0.000 && this.mediaProveedores < 0.481) {
            this.emesionesVisible = false;
            this.EtiquetaProveedores = {
              color: 'rgb(0, 0, 0)',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '-5%',
            };

            this.HRproveedores = {
              height: '2px',
              width: '72%',
              'background-color': 'rgb(94 120 53)',
              position: 'absolute',
              right: 0,
              top: '-3%',
            };

            this.ValorProveedores = {
              color: 'rgb(0, 0, 0)',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '5%'
            };

            // tslint:disable-next-line: max-line-length
            if ((this.mediaProveedores >= 0.000 && this.mediaProveedores < 0.481) && (this.mediaInhdelva >= 0.000 && this.mediaInhdelva < 0.481)) {
              this.EtiquetaProveedores = {
                color: 'rgb(0, 0, 0)',
                'font-size': '13px',
                position: 'absolute',
                right: '140px',
                top: '-5%',
              };

              this.HRproveedores = {
                height: '2px',
                width: '72%',
                'background-color': 'rgb(94 120 53)',
                position: 'absolute',
                right: 0,
                top: '-3%',
              };

              this.ValorProveedores = {
                color: 'rgb(0, 0, 0)',
                'font-size': '13px',
                position: 'absolute',
                right: '150px',
                top: '5%'
              };
            }

          } else if (this.mediaProveedores >= 0.481 && this.mediaProveedores < 0.569) {

            this.EtiquetaProveedores = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '16%'
            };

            this.HRproveedores = {
              height: '2px',
              width: '69%',
              'background-color': 'rgb(142 178 62)',
              position: 'absolute',
              right: 0,
              top: '17%',
            };

            this.ValorProveedores = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '25%'
            };

            // tslint:disable-next-line: max-line-length
            if ((this.mediaProveedores >= 0.481 && this.mediaProveedores < 0.569) && (this.mediaInhdelva >= 0.481 && this.mediaInhdelva < 0.569)) {
              this.EtiquetaProveedores = {
                color: '#000000',
                'font-size': '13px',
                position: 'absolute',
                right: '140px',
                top: '16%'
              };

              this.HRproveedores = {
                height: '2px',
                width: '69%',
                'background-color': 'rgb(142 178 62)',
                position: 'absolute',
                right: 0,
                top: '17%',
              };

              this.ValorProveedores = {
                color: '#000000',
                'font-size': '13px',
                position: 'absolute',
                right: '150px',
                top: '25%'
              };
            }
          } else if (this.mediaProveedores >= 0.569 && this.mediaProveedores < 0.635) {

            this.EtiquetaProveedores = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '35%'
            };

            this.HRproveedores = {
              height: '2px',
              width: ' 59%',
              'background-color': 'rgb(249, 211, 42)',
              position: 'absolute',
              right: 0,
              top: '37%'
            };

            this.ValorProveedores = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '45%'
            };

            // tslint:disable-next-line: max-line-length
            if ((this.mediaProveedores >= 0.569 && this.mediaProveedores < 0.635) && (this.mediaInhdelva >= 0.569 && this.mediaInhdelva < 0.635)) {
              this.EtiquetaProveedores = {
                color: '#000000',
                'font-size': '13px',
                position: 'absolute',
                right: '140px',
                top: '35%'
              };

              this.HRproveedores = {
                height: '2px',
                width: ' 59%',
                'background-color': 'rgb(249, 211, 42)',
                position: 'absolute',
                right: 0,
                top: '37%'
              };

              this.ValorProveedores = {
                color: '#000000',
                'font-size': '13px',
                position: 'absolute',
                right: '150px',
                top: '45%'
              };
            }

          } else if (this.mediaProveedores >= 0.635 && this.mediaProveedores < 0.851) {

            this.EtiquetaProveedores = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '55%'
            };

            this.HRproveedores = {
              height: '2px',
              width: '54%',
              'background-color': 'rgb(227, 125, 37)',
              position: 'absolute',
              right: 0,
              top: ' 57%',
            };

            this.ValorProveedores = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '64%',
            };

            // tslint:disable-next-line: max-line-length
            if ((this.mediaProveedores >= 0.635 && this.mediaProveedores < 0.851) && (this.mediaInhdelva >= 0.635 && this.mediaInhdelva < 0.851)) {
              this.EtiquetaProveedores = {
                color: '#000000',
                'font-size': '13px',
                position: 'absolute',
                right: '140px',
                top: '55%'
              };

              this.HRproveedores = {
                height: '2px',
                width: '54%',
                'background-color': 'rgb(227, 125, 37)',
                position: 'absolute',
                right: 0,
                top: ' 57%',
              };

              this.ValorProveedores = {
                color: '#000000',
                'font-size': '13px',
                position: 'absolute',
                right: '150px',
                top: '64%',
              };
            }

          } else if (this.mediaProveedores >= 0.851) {

            this.EtiquetaProveedores = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '74%'
            };

            this.HRproveedores = {
              height: '2px',
              width: '49%',
              'background-color': 'rgb(224 94 38)',
              position: 'absolute',
              right: 0,
              top: '76%'
            };

            this.ValorProveedores = {
              color: '#000000',
              'font-size': '13px',
              position: 'absolute',
              right: 0,
              top: '83%'
            };

            if ((this.mediaProveedores >= 0.851) && (this.mediaInhdelva >= 0.851)) {

              this.EtiquetaProveedores = {
                color: '#000000',
                'font-size': '13px',
                position: 'absolute',
                right: '140px',
                top: '74%'
              };

              this.HRproveedores = {
                height: '2px',
                width: '49%',
                'background-color': 'rgb(224 94 38)',
                position: 'absolute',
                right: 0,
                top: '76%'
              };

              this.ValorProveedores = {
                color: '#000000',
                'font-size': '13px',
                position: 'absolute',
                right: '150px',
                top: '83%'
              };

            }
          }

          this.dataSourceMatrizProveedores = {
            chart: {
              caption: 'Matriz energética de Proveedoes', // Set the chart caption
              valuePosition: 'inside',
              showLabels: '0',
              formatNumberScale: 0,
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
              valuePosition: 'inside',
              showLabels: '1',
              showValues: 1,
              formatNumberScale: 0,
              theme: 'fusion' // Set the theme for your chart
            },
            data: this.chartDataConsumo
          };

          this.BloquesdeEnergiaFactura.forEach(x => {
            this.totalConsumo += x.valor;
          });

          this.energiaReactiva = this.DetalleFacturaData[3].valor - this.DetalleFacturaData[4].valor;
          this.totalApagar = this.DetalleFacturaData[28].valor + this.DetalleFacturaData[11].valor;
          this.penalidad = this.DetalleFacturaData[35].valor * this.DetalleFacturaData[29].valor * this.totalConsumo;
          this.resultadoFactorP = Math.round(this.totalConsumo / (Math.sqrt(Math.pow(this.totalConsumo, 2) + Math.pow(this.DetalleFacturaData[34].valor, 2))) * 100) / 100;

          this.factorRecargo = (this.resultadoFactorP >= 0 && this.resultadoFactorP < 0.9) ? Math.round(((0.9 / this.resultadoFactorP) - 1) * 100) / 100 : 0;

          if (this.EncabezadoFacturaData.tarifa.puntoMedicionId === 1) {
            this.resultadoPenalidad = this.factorRecargo * (Math.round(this.DetalleFacturaData[12].valor * 100) / 100 + Math.round(this.penalidad * 100) / 100);

          } else {
            this.resultadoPenalidad = this.factorRecargo * ((Math.round(this.DetalleFacturaData[12].valor * 100) / 100) + (Math.round(this.penalidad * 100) / 100) + (Math.round(this.DetalleFacturaData[13].valor * 100) / 100));
          }

          for (let x = 12; x < 28; x++) {
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

  generarPDF() {
    this.spinner.show();
    const div = document.getElementById('content');
    const anexo = document.getElementById('anexo');

    const options = {
      background: 'white',
      scale: 3
    };

    // const divs: any[] = [div, anexo];
    const doc = new jsPDF('p', 'mm', 'a4', true);

    html2canvas(div, options).then((canvas) => {
      var img = canvas.toDataURL("image/PNG");
      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      (doc as any).addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((doc) => {

      if (this.isVisibleAnexo) {

        html2canvas(anexo, options).then((canvas) => {
          var img = canvas.toDataURL("image/PNG");
          // Add image Canvas to PDF
          const bufferX = 5;
          const bufferY = 5;
          const imgProps = (<any>doc).getImageProperties(img);
          const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

          doc.addPage('p');
          (doc as any).addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

          return doc;
        }).then((doc) => {
          doc.save(`factura-${this.dataFactura.codigo}.pdf`);
          this.spinner.hide();
        })

      } else {
        doc.save(`factura-${this.dataFactura.codigo}.pdf`);
        this.spinner.hide();
      }
    });
  }
}
