import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert';
import { ReportesService } from '../../servicios/reportes.service';
import { NgxSpinnerService } from 'ngx-spinner';
import 'jspdf-autotable';
import jspdf from 'jspdf';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'app-produccion',
  templateUrl: './produccion.component.html',
  styleUrls: ['./produccion.component.scss']
})
export class ProduccionComponent implements OnInit {

  listOfDataProduccion: any[] = [];
  listaTotales: any[] = [];
  dataExport: any[] = [];
  date = null;
  fechas = null;
  isVisible = false;
  cols: any[];
  dataPDF: any[] = [];
  colsExport: any[] = [];
  dataPDFExport: any[] = [];

  constructor(
    private reporteService: ReportesService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {

  }

  onChange(result: Date): void {
    console.log('onChange: ', result);
  }

  consultar() {
    this.listOfDataProduccion = [];
    this.listaTotales = [];
    this.dataExport = [];
    this.dataPDF = [];
    this.dataPDFExport = [];
    this.cols = [];
    this.colsExport = [];

    this.spinner.show();
    if (this.fechas === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un rango de fechas'
      });
      this.isVisible = false;
    } else {

      this.reporteService.produccion(
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')}T06:00:00.000Z`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')}T06:00:00.000Z`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            console.log(data);

            this.isVisible = true;

            let a = 1;
            for (let h = 1; h <= data.length; h++) {

              this.listOfDataProduccion = [...this.listOfDataProduccion, {
                x: a,
                fecha: data[h - 1].fecha,
                produccionTotalEnergiaSolar: data[h - 1].produccionTotalEnergiaSolar,
                energiaExportadaHaciaRed: data[h - 1].energiaExportadaHaciaRed,
                energiaAutoconsumoINH: data[h - 1].energiaAutoconsumoINH,
                energiaConsumidaRed: data[h - 1].energiaConsumidaRed,
                consumoEnergiaTotalINH: data[h - 1].consumoEnergiaTotalINH,
                fraccionEnergiaSolarAutoconsumo: data[h - 1].fraccionEnergiaSolarAutoconsumo ,
                fraccionEnergiaSolarTotal: data[h - 1].fraccionEnergiaSolarTotal ,
                costoEnergiaINH: data[h - 1].costoEnergiaINH,
                energiaTotalINH: data[h - 1].energiaTotalINH,
                costoTotalEnergiaINH: data[h - 1].costoTotalEnergiaINH,
                consumoActualEnergiaRed: data[h - 1].consumoActualEnergiaRed,
                costoEnergiaConsumidaRed: data[h - 1].costoEnergiaConsumidaRed,
                ahorroEnergiaSolar: data[h - 1].ahorroEnergiaSolar,
                ahorroSolar: data[h - 1].ahorroSolar,
                produccionRealEnergiaSolar: data[h - 1].produccionRealEnergiaSolar,
                produccionEstimadaEnergiaSolar: data[h - 1].produccionEstimadaEnergiaSolar,
                degradacionMaxima: data[h - 1].degradacionMaxima ,
                porcentajeCumplimiento: data[h - 1].porcentajeCumplimiento
              }]
              if (h <= (data.length - 1)) {
                if ((moment(this.listOfDataProduccion[this.listOfDataProduccion.length - 1].fecha).get('year') !== moment(data[h].fecha).get('year'))) {
                  a += 1;
                }
              }

              this.dataExport = [...this.dataExport, {
                'Año de operación': a,
                'Mes de operación': moment(data[h - 1].fecha).format('MM'),
                'Mes calendario': moment(data[h - 1].fecha).format('MMMM'),
                'Año calendario': moment(data[h - 1].fecha).format('YYYY'),
                'Fecha': moment(data[h - 1].fecha).format('MM/YYYY'),
                'Producción total Energía Solar (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].produccionTotalEnergiaSolar),
                'Energía exportada hacia la red (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].energiaExportadaHaciaRed),
                'Energía en autoconsumo en INHDELVA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].energiaAutoconsumoINH),
                'Energía consumida de la red (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].energiaConsumidaRed),
                'Consumo de energía total INHDELVA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].consumoEnergiaTotalINH),
                'Fraccion de energía solar en autoconsumo (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].fraccionEnergiaSolarAutoconsumo * 100),
                'Fraccion de energía solar total (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].fraccionEnergiaSolarTotal * 100),
                'Costo de Energia INHDELVA (Lps/kWh)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(data[h - 1].costoEnergiaINH),
                'Energia total INHDELVA (kWh/año)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].energiaTotalINH),
                'Costo total de energía INHDELVA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].costoTotalEnergiaINH),
                'Consumo actual de energía de la red (kWh/año)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].consumoActualEnergiaRed),
                'Costo energía consumida de la red (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].costoEnergiaConsumidaRed),
                'Ahorro en energía por sistema solar (kWh/año)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].ahorroEnergiaSolar),
                'Ahorro por sistema solar (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].ahorroSolar),
                'Producción real Energia Solar (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].produccionRealEnergiaSolar),
                'Producción estimada energía solar P50 (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].produccionEstimadaEnergiaSolar),
                'Degradacion maxima según garantia de modulos (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].degradacionMaxima * 100),
                'Porcentaje de cumplimiento (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data[h - 1].porcentajeCumplimiento * 100)
              }]
            }

            this.listaTotales = this.listOfDataProduccion.reduce((acumulador, valorActual) => {
              const elementoYaExiste = acumulador.find(elemento => elemento.x === valorActual.x);
              if (elementoYaExiste) {
                return acumulador.map((elemento) => {
                  if (elemento.x === valorActual.x) {
                    return {
                      ...elemento,
                      x: elemento.x,
                      produccionTotalEnergiaSolar: elemento.produccionTotalEnergiaSolar + valorActual.produccionTotalEnergiaSolar,
                      energiaExportadaHaciaRed: elemento.energiaExportadaHaciaRed + valorActual.energiaExportadaHaciaRed,
                      energiaAutoconsumoINH: elemento.energiaAutoconsumoINH + valorActual.energiaAutoconsumoINH,
                      energiaConsumidaRed: elemento.energiaConsumidaRed + valorActual.energiaConsumidaRed,
                      consumoEnergiaTotalINH: elemento.consumoEnergiaTotalINH + valorActual.consumoEnergiaTotalINH,
                      fraccionEnergiaSolarAutoconsumo: 0,
                      fraccionEnergiaSolarTotal: 0,
                      costoEnergiaINH: 0,
                      energiaTotalINH: elemento.energiaTotalINH + valorActual.energiaTotalINH,
                      costoTotalEnergiaINH: elemento.costoTotalEnergiaINH + valorActual.costoTotalEnergiaINH,
                      consumoActualEnergiaRed: elemento.consumoActualEnergiaRed + valorActual.consumoActualEnergiaRed,
                      costoEnergiaConsumidaRed: elemento.costoEnergiaConsumidaRed + valorActual.costoEnergiaConsumidaRed,
                      ahorroEnergiaSolar: elemento.ahorroEnergiaSolar + valorActual.ahorroEnergiaSolar,
                      ahorroSolar: elemento.ahorroSolar + valorActual.ahorroSolar,
                      produccionRealEnergiaSolar: elemento.produccionRealEnergiaSolar + valorActual.produccionRealEnergiaSolar,
                      produccionEstimadaEnergiaSolar: elemento.produccionEstimadaEnergiaSolar + valorActual.produccionEstimadaEnergiaSolar,
                      degradacionMaxima: 0,
                      porcentajeCumplimiento: 0
                    };
                  }
                  return elemento;
                });
              }

              return [...acumulador, valorActual];
            }, []);

            this.listaTotales.forEach(z => {
              z.fraccionEnergiaSolarAutoconsumo = (z.energiaAutoconsumoINH / z.consumoEnergiaTotalINH) * 100;
              z.fraccionEnergiaSolarTotal = (z.produccionTotalEnergiaSolar / z.consumoEnergiaTotalINH) * 100;
              z.costoEnergiaINH = (z.costoTotalEnergiaINH / z.energiaTotalINH);
              z.degradacionMaxima = z.degradacionMaxima / this.listOfDataProduccion.length;
              z.porcentajeCumplimiento = (z.produccionRealEnergiaSolar / z.produccionEstimadaEnergiaSolar) * 100;
            })

            this.listaTotales.forEach(y => {
              this.dataExport = [...this.dataExport, {
                'Año de operación': '',
                'Mes de operación': '',
                'Mes calendario': '',
                'Año calendario': `AÑO ${(y.x === undefined) ? 1 : y.x}`,
                'Fecha': 'TOTAL',
                'Producción total Energía Solar (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.produccionTotalEnergiaSolar),
                'Energía exportada hacia la red (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.energiaExportadaHaciaRed),
                'Energía en autoconsumo en INHDELVA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.energiaAutoconsumoINH),
                'Energía consumida de la red (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.energiaConsumidaRed),
                'Consumo de energía total INHDELVA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.consumoEnergiaTotalINH),
                'Fraccion de energía solar en autoconsumo (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.fraccionEnergiaSolarAutoconsumo),
                'Fraccion de energía solar total (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.fraccionEnergiaSolarTotal),
                'Costo de Energia INHDELVA (Lps/kWh)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(y.costoEnergiaINH),
                'Energia total INHDELVA (kWh/año)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.energiaTotalINH),
                'Costo total de energía INHDELVA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.costoTotalEnergiaINH),
                'Consumo actual de energía de la red (kWh/año)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.consumoActualEnergiaRed),
                'Costo energía consumida de la red (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.costoEnergiaConsumidaRed),
                'Ahorro en energía por sistema solar (kWh/año)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.ahorroEnergiaSolar),
                'Ahorro por sistema solar (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.ahorroSolar),
                'Producción real Energia Solar (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.produccionRealEnergiaSolar),
                'Producción estimada energía solar P50 (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.produccionEstimadaEnergiaSolar),
                'Degradacion maxima según garantia de modulos (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.degradacionMaxima),
                'Porcentaje de cumplimiento (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(y.porcentajeCumplimiento)
              }]
            });

            this.cols = [['Descripcion', ...this.dataExport.map(x => x.Fecha)]]
            this.dataPDF = [
              ['Año de operación', ...this.dataExport.map(x => x['Año de operación'])],
              ['Mes de operación', ...this.dataExport.map(x => x['Mes de operación'])],
              ['Mes calendario', ...this.dataExport.map(x => x['Mes calendario'])],
              ['Año calendario', ...this.dataExport.map(x => x['Año calendario'])],
              ['Producción total Energía Solar (kWh/mes)', ...this.dataExport.map(x => x['Producción total Energía Solar (kWh/mes)'])],
              ['Energía exportada hacia la red (kWh/mes)', ...this.dataExport.map(x => x['Energía exportada hacia la red (kWh/mes)'])],
              ['Energía en autoconsumo en INHDELVA (kWh/mes)', ...this.dataExport.map(x => x['Energía en autoconsumo en INHDELVA (kWh/mes)'])],
              ['Energía consumida de la red (kWh/mes)', ...this.dataExport.map(x => x['Energía consumida de la red (kWh/mes)'])],
              ['Consumo de energía total INHDELVA (kWh/mes)', ...this.dataExport.map(x => x['Consumo de energía total INHDELVA (kWh/mes)'])],
              ['Fraccion de energía solar en autoconsumo (%)', ...this.dataExport.map(x => x['Fraccion de energía solar en autoconsumo (%)'])],
              ['Fraccion de energía solar total (%)', ...this.dataExport.map(x => x['Fraccion de energía solar total (%)'])],
              ['Costo de Energia INHDELVA (Lps/kWh)', ...this.dataExport.map(x => x['Costo de Energia INHDELVA (Lps/kWh)'])],
              ['Energia total INHDELVA (kWh/año)', ...this.dataExport.map(x => x['Energia total INHDELVA (kWh/año)'])],
              ['Costo total de energía INHDELVA (Lps)', ...this.dataExport.map(x => x['Costo total de energía INHDELVA (Lps)'])],
              ['Consumo actual de energía de la red (kWh/año)', ...this.dataExport.map(x => x['Consumo actual de energía de la red (kWh/año)'])],
              ['Costo energía consumida de la red (Lps)', ...this.dataExport.map(x => x['Costo energía consumida de la red (Lps)'])],
              ['Ahorro en energía por sistema solar (kWh/año)', ...this.dataExport.map(x => x['Ahorro en energía por sistema solar (kWh/año)'])],
              ['Ahorro por sistema solar (Lps)', ...this.dataExport.map(x => x['Ahorro por sistema solar (Lps)'])],
              ['Producción real Energia Solar (kWh/mes)', ...this.dataExport.map(x => x['Producción real Energia Solar (kWh/mes)'])],
              ['Producción estimada energía solar P50 (kWh/mes)', ...this.dataExport.map(x => x['Producción estimada energía solar P50 (kWh/mes)'])],
              ['Degradacion maxima según garantia de modulos (%)', ...this.dataExport.map(x => x['Degradacion maxima según garantia de modulos (%)'])],
              ['Porcentaje de cumplimiento (%)', ...this.dataExport.map(x => x['Porcentaje de cumplimiento (%)'])]
            ]

            if (this.listOfDataProduccion.length === 0) {
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
    // let pag = new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(tamano / 4);

    this.colsExport[0] = this.cols[0].slice(0, 6);
    this.dataPDFExport[0] = this.dataPDF[0].slice(0, 6);
    this.dataPDFExport[1] = this.dataPDF[1].slice(0, 6);
    this.dataPDFExport[2] = this.dataPDF[2].slice(0, 6);
    this.dataPDFExport[3] = this.dataPDF[3].slice(0, 6);
    this.dataPDFExport[4] = this.dataPDF[4].slice(0, 6);
    this.dataPDFExport[5] = this.dataPDF[5].slice(0, 6);
    this.dataPDFExport[6] = this.dataPDF[6].slice(0, 6);
    this.dataPDFExport[7] = this.dataPDF[7].slice(0, 6);
    this.dataPDFExport[8] = this.dataPDF[8].slice(0, 6);
    this.dataPDFExport[9] = this.dataPDF[9].slice(0, 6);
    this.dataPDFExport[10] = this.dataPDF[10].slice(0, 6);
    this.dataPDFExport[11] = this.dataPDF[11].slice(0, 6);
    this.dataPDFExport[12] = this.dataPDF[12].slice(0, 6);
    this.dataPDFExport[13] = this.dataPDF[13].slice(0, 6);
    this.dataPDFExport[14] = this.dataPDF[14].slice(0, 6);
    this.dataPDFExport[15] = this.dataPDF[15].slice(0, 6);
    this.dataPDFExport[16] = this.dataPDF[16].slice(0, 6);
    this.dataPDFExport[17] = this.dataPDF[17].slice(0, 6);
    this.dataPDFExport[18] = this.dataPDF[18].slice(0, 6);
    this.dataPDFExport[19] = this.dataPDF[19].slice(0, 6);
    this.dataPDFExport[20] = this.dataPDF[20].slice(0, 6);
    this.dataPDFExport[21] = this.dataPDF[21].slice(0, 6);

    const doc = new jspdf('p', 'in', 'letter');
    (doc as any).autoTable(
      {
        head: this.colsExport,
        body: this.dataPDFExport,
        theme: 'striped',
        styles: { fontSize: 6, halign: 'right' },
        columnStyles: {
          0: { halign: 'left' }
        }
      }
    );

    for (let x = 6; x < tamano;) {
      this.colsExport[0] = this.cols[0].slice(x, (x + 6));
      this.dataPDFExport[0] = this.dataPDF[0].slice(x, (x + 6));
      this.dataPDFExport[1] = this.dataPDF[1].slice(x, (x + 6));
      this.dataPDFExport[2] = this.dataPDF[2].slice(x, (x + 6));
      this.dataPDFExport[3] = this.dataPDF[3].slice(x, (x + 6));
      this.dataPDFExport[4] = this.dataPDF[4].slice(x, (x + 6));
      this.dataPDFExport[5] = this.dataPDF[5].slice(x, (x + 6));
      this.dataPDFExport[6] = this.dataPDF[6].slice(x, (x + 6));
      this.dataPDFExport[7] = this.dataPDF[7].slice(x, (x + 6));
      this.dataPDFExport[8] = this.dataPDF[8].slice(x, (x + 6));
      this.dataPDFExport[9] = this.dataPDF[9].slice(x, (x + 6));
      this.dataPDFExport[10] = this.dataPDF[10].slice(x, (x + 6));
      this.dataPDFExport[11] = this.dataPDF[11].slice(x, (x + 6));
      this.dataPDFExport[12] = this.dataPDF[12].slice(x, (x + 6));
      this.dataPDFExport[13] = this.dataPDF[13].slice(x, (x + 6));
      this.dataPDFExport[14] = this.dataPDF[14].slice(x, (x + 6));
      this.dataPDFExport[15] = this.dataPDF[15].slice(x, (x + 6));
      this.dataPDFExport[16] = this.dataPDF[16].slice(x, (x + 6));
      this.dataPDFExport[17] = this.dataPDF[17].slice(x, (x + 6));
      this.dataPDFExport[18] = this.dataPDF[18].slice(x, (x + 6));
      this.dataPDFExport[19] = this.dataPDF[19].slice(x, (x + 6));
      this.dataPDFExport[20] = this.dataPDF[20].slice(x, (x + 6));
      this.dataPDFExport[21] = this.dataPDF[21].slice(x, (x + 6));

      doc.addPage('p');
      (doc as any).autoTable(
        {
          head: this.colsExport,
          body: this.dataPDFExport,
          theme: 'striped',
          styles: { fontSize: 6, halign: 'right' }
        }
      );

      x = x + 6;
    }

    doc.save('InformeProduccion.pdf');
  }

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataExport);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'Informe de Produccion ');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    import('file-saver').then(FileSaver => {
      let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      let EXCEL_EXTENSION = '.xlsx';
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + EXCEL_EXTENSION);
    });
  }

}

