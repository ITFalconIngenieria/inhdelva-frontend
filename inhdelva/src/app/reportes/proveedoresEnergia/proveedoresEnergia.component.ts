import { Component, OnInit } from '@angular/core';
import { ReportesService } from '../../servicios/reportes.service';
import { ActoresService } from '../../servicios/actores.service';
import * as moment from 'moment';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';
import 'jspdf-autotable';
import jspdf from 'jspdf';

@Component({
  selector: 'app-proveedoresEnergia',
  templateUrl: './proveedoresEnergia.component.html',
  styleUrls: ['./proveedoresEnergia.component.scss']
})
export class ProveedoresEnergiaComponent implements OnInit {
  listOfData: any[] = [];
  date = null;
  abrir = false;
  isVisible = false;
  proveedores: any[] = [];
  fechas = null;
  listOfProveedores: any[] = [];
  listaIDProveedores: any[] = [];
  listaTotales: any[] = [];
  dataExport: any[] = [];

  cols: any[];
  dataPDF: any[] = [];
  colsExport: any[] = [];
  dataPDFExport: any[] = [];

  constructor(
    private reporteService: ReportesService,
    private proveedoresService: ActoresService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

    this.proveedoresService.getProveedores()
      .toPromise()
      .then(
        (data: any[]) => {
          this.listOfProveedores = data;

          data.forEach(x => {
            this.listaIDProveedores = [x.Id, ...this.listaIDProveedores];
          });

        }
      );

  }

  proveedoresChange(event: any[]) {

    if (event.includes('0')) {
      this.abrir = false;
      this.proveedores = ['0'];
    } else {
      this.abrir = true;
    }

    if (event.length === 0) {
      this.proveedores = null;
    }

  }

  consultar() {
    this.cols =[];

    this.colsExport =[];
    this.dataExport =[];
    this.dataPDF =[];
    this.dataPDFExport =[];
    this.listOfData =[];
    this.listaTotales =[];

    this.spinner.show();
    if (this.proveedores.length === 0 || this.fechas === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un proveedor y un rango de fechas'
      });
      this.isVisible = false;
    } else {

      this.proveedores = (this.proveedores.includes('0')) ? this.listaIDProveedores : this.proveedores;

      this.reporteService.proveedoresEnergia(
        this.proveedores,
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')} 00:00:00`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')} 00:00:00`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {

            console.log(data);
            
            this.isVisible = true;
            this.listOfData = data;

            this.listaTotales = this.listOfData.reduce((acumulador, valorActual) => {
              const elementoYaExiste = acumulador.find(elemento => elemento.proveedor === valorActual.proveedor);
              if (elementoYaExiste) {
                return acumulador.map((elemento) => {
                  if (elemento.proveedor === valorActual.proveedor) {
                    return {
                      ...elemento,
                      consumoEnergiaActiva: Math.round((elemento.consumoEnergiaActiva + valorActual.consumoEnergiaActiva)* 100) / 100,
                      energiaActivaExportada: Math.round((elemento.energiaActivaExportada + valorActual.energiaActivaExportada)* 100) / 100,
                      demandaPotenciaMaxima: Math.round((elemento.demandaPotenciaMaxima + valorActual.demandaPotenciaMaxima)* 100) / 100,
                      consumoEnergiaReactiva: Math.round((elemento.consumoEnergiaReactiva + valorActual.consumoEnergiaReactiva)* 100) / 100,
                      factorPotencia: Math.round((elemento.factorPotencia + valorActual.factorPotencia)* 100) / 100,
                      precioEnergia: Math.round((elemento.precioEnergia + valorActual.precioEnergia)* 100) / 100,
                      costoDemanda: Math.round((elemento.costoDemanda + valorActual.costoDemanda)* 100) / 100,
                      costoEnergia: Math.round((elemento.costoEnergia + valorActual.costoEnergia)* 100) / 100,
                      alumbradoPublico: Math.round((elemento.alumbradoPublico + valorActual.alumbradoPublico)* 100) / 100,
                      cargoComercializacion: Math.round((elemento.consumoEnergiaActiva + valorActual.cargoComercializacion)* 100) / 100,
                      cargoRegulacion: Math.round((elemento.cargoRegulacion + valorActual.cargoRegulacion)* 100) / 100,
                      precioDemanda: Math.round((elemento.precioDemanda + valorActual.precioDemanda)* 100) / 100,
                      total: Math.round((elemento.total + valorActual.total)* 100) / 100
                    };
                  }
                  return elemento;
                });
              }
              return [...acumulador, valorActual];
            }, []);

            this.listOfData.forEach(y => {
              this.dataExport = [...this.dataExport, {
                'PROVEEDOR': y.proveedor,
                'Año': moment(y.fecha).format('YYYY'),
                'Mes': moment(y.fecha).format('MM'),
                'Fecha': moment(y.fecha).format('MM/YYYY'),
                'Consumo Energia activa (kWh/mes)': Math.round(y.consumoEnergiaActiva* 100) / 100,
                'Energia activa exportada (kWh/mes)': Math.round(y.energiaActivaExportada* 100) / 100,
                'Demanda potencia maxima (kW)': Math.round(y.demandaPotenciaMaxima* 100) / 100,
                'Consumo Energia reactiva (kVArh/mes)': Math.round(y.consumoEnergiaReactiva* 100) / 100,
                'Factor de Potencia': Math.round(y.factorPotencia* 100) / 100,
                'Costo de la Energia (L/kWh)': Math.round(y.precioEnergia* 100) / 100,
                'Costo de la Demanda (L/kW-mes)': Math.round(y.costoDemanda* 100) / 100,
                'Costo de la Energia (L)': Math.round(y.costoEnergia* 100) / 100,
                'Alumbrado Público (L)': Math.round(y.alumbradoPublico* 100) / 100,
                'Cargo de Comercialización (L)': Math.round(y.cargoComercializacion* 100) / 100,
                'Cargo de Regulación (L)': Math.round(y.cargoRegulacion* 100) / 100,
                'Demanda (L)': Math.round(y.precioDemanda* 100) / 100,
                'TOTAL (L)': Math.round(y.total* 100) / 100
              }]
            });

            this.listaTotales.forEach(x => {
              this.dataExport = [...this.dataExport, {
                'PROVEEDOR': x.proveedor,
                'Año': '',
                'Mes': '',
                'Fecha': 'TOTALES',
                'Consumo Energia activa (kWh/mes)': Math.round(x.consumoEnergiaActiva* 100) / 100,
                'Energia activa exportada (kWh/mes)': Math.round(x.energiaActivaExportada* 100) / 100,
                'Demanda potencia maxima (kW)': Math.round(x.demandaPotenciaMaxima* 100) / 100,
                'Consumo Energia reactiva (kVArh/mes)': Math.round(x.consumoEnergiaReactiva* 100) / 100,
                'Factor de Potencia': Math.round(x.factorPotencia* 100) / 100,
                'Costo de la Energia (L/kWh)': Math.round(x.precioEnergia* 100) / 100,
                'Costo de la Demanda (L/kW-mes)': Math.round(x.costoDemanda* 100) / 100,
                'Costo de la Energia (L)': Math.round(x.costoEnergia* 100) / 100,
                'Alumbrado Público (L)': Math.round(x.alumbradoPublico* 100) / 100,
                'Cargo de Comercialización (L)': Math.round(x.cargoComercializacion* 100) / 100,
                'Cargo de Regulación (L)': Math.round(x.cargoRegulacion* 100) / 100,
                'Demanda (L)': Math.round(x.precioDemanda* 100) / 100,
                'TOTAL (L)': Math.round(x.total* 100) / 100
              }]
            });

            this.cols = [['Descripcion', ...this.dataExport.map(x => x.Fecha)]]
            this.dataPDF = [
              ['PROVEEDOR', ...this.dataExport.map(x => x['PROVEEDOR'])],
              ['Año', ...this.dataExport.map(x => x['Año'])],
              ['Consumo Energia activa (kWh/mes)', ...this.dataExport.map(x => x['Consumo Energia activa (kWh/mes)'])],
              ['Energia activa exportada (kWh/mes)', ...this.dataExport.map(x => x['Energia activa exportada (kWh/mes)'])],
              ['Demanda potencia maxima (kW)', ...this.dataExport.map(x => x['Demanda potencia maxima (kW)'])],
              ['Consumo Energia reactiva (kVArh/mes)', ...this.dataExport.map(x => x['Consumo Energia reactiva (kVArh/mes)'])],
              ['Factor de Potencia', ...this.dataExport.map(x => x['Factor de Potencia'])],
              ['Costo de la Energia (L/kWh)', ...this.dataExport.map(x => x['Costo de la Energia (L/kWh)'])],
              ['Costo de la Demanda (L/kW-mes)', ...this.dataExport.map(x => x['Costo de la Demanda (L/kW-mes)'])],
              ['Costo de la Energia (L)', ...this.dataExport.map(x => x['Costo de la Energia (L)'])],
              ['Alumbrado Público (L)', ...this.dataExport.map(x => x['Alumbrado Público (L)'])],
              ['Cargo de Comercialización (L)', ...this.dataExport.map(x => x['Cargo de Comercialización (L)'])],
              ['Cargo de Regulación (L)', ...this.dataExport.map(x => x['Cargo de Regulación (L)'])],
              ['Demanda (L)', ...this.dataExport.map(x => x['Demanda (L)'])],
              ['TOTAL (L)', ...this.dataExport.map(x => x['TOTAL (L)'])]
            ]

            if (this.listOfData.length === 0) {
              this.spinner.hide();
              this.isVisible = false;
              swal({
                icon: 'warning',
                title: 'No se pudo encontrar información'
                // text: 'Por verifique las opciones seleccionadas.'
              });
            }

            this.spinner.hide();
          },
          (error) => {
            this.spinner.hide();
            this.isVisible = false;
            swal({
              icon: 'warning',
              title: 'No se pudo encontrar información',
              text: 'Por verifique las opciones seleccionadas.'
            });

            console.log(error);
          }
        );
    }

  }

  exportPdf() {
    let tamano = this.cols[0].length;

    this.colsExport[0] = this.cols[0].slice(0, 4);
    this.dataPDFExport[0] = this.dataPDF[0].slice(0, 4);
    this.dataPDFExport[1] = this.dataPDF[1].slice(0, 4);
    this.dataPDFExport[2] = this.dataPDF[2].slice(0, 4);
    this.dataPDFExport[3] = this.dataPDF[3].slice(0, 4);
    this.dataPDFExport[4] = this.dataPDF[4].slice(0, 4);
    this.dataPDFExport[5] = this.dataPDF[5].slice(0, 4);
    this.dataPDFExport[6] = this.dataPDF[6].slice(0, 4);
    this.dataPDFExport[7] = this.dataPDF[7].slice(0, 4);
    this.dataPDFExport[8] = this.dataPDF[8].slice(0, 4);
    this.dataPDFExport[9] = this.dataPDF[9].slice(0, 4);
    this.dataPDFExport[10] = this.dataPDF[10].slice(0, 4);
    this.dataPDFExport[11] = this.dataPDF[11].slice(0, 4);
    this.dataPDFExport[12] = this.dataPDF[12].slice(0, 4);
    this.dataPDFExport[13] = this.dataPDF[13].slice(0, 4);
    this.dataPDFExport[14] = this.dataPDF[14].slice(0, 4);

    const doc = new jspdf('p', 'in', 'letter');
    (doc as any).autoTable(
      {
        head: this.colsExport,
        body: this.dataPDFExport,
        theme: 'striped'
      }
    );

    for (let x = 4; x < tamano;) {
      this.colsExport[0] = this.cols[0].slice(x, (x + 4));
      this.dataPDFExport[0] = this.dataPDF[0].slice(x, (x + 4));
      this.dataPDFExport[1] = this.dataPDF[1].slice(x, (x + 4));
      this.dataPDFExport[2] = this.dataPDF[2].slice(x, (x + 4));
      this.dataPDFExport[3] = this.dataPDF[3].slice(x, (x + 4));
      this.dataPDFExport[4] = this.dataPDF[4].slice(x, (x + 4));
      this.dataPDFExport[5] = this.dataPDF[5].slice(x, (x + 4));
      this.dataPDFExport[6] = this.dataPDF[6].slice(x, (x + 4));
      this.dataPDFExport[7] = this.dataPDF[7].slice(x, (x + 4));
      this.dataPDFExport[8] = this.dataPDF[8].slice(x, (x + 4));
      this.dataPDFExport[9] = this.dataPDF[9].slice(x, (x + 4));
      this.dataPDFExport[10] = this.dataPDF[10].slice(x, (x + 4));
      this.dataPDFExport[11] = this.dataPDF[11].slice(x, (x + 4));
      this.dataPDFExport[12] = this.dataPDF[12].slice(x, (x + 4));
      this.dataPDFExport[13] = this.dataPDF[13].slice(x, (x + 4));
      this.dataPDFExport[14] = this.dataPDF[14].slice(x, (x + 4));

      doc.addPage('p');
      (doc as any).autoTable(
        {
          head: this.colsExport,
          body: this.dataPDFExport,
          theme: 'striped'
        }
      );

      x = x + 4;
    }

    doc.save('InformeProveedoresDeEnergia.pdf');
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataExport);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Proveedores_de_Energia');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + EXCEL_EXTENSION);
    });
  }

}
