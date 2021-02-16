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
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')} 00:00:00`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')} 00:00:00`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.isVisible = true;

            let a = 1;
            for (let h = 1; h <= data.length; h++) {

              this.listOfDataProduccion = [...this.listOfDataProduccion, {
                x: a,
                fecha: data[h - 1].fecha,
                produccionTotalEnergiaSolar: Math.round(data[h - 1].produccionTotalEnergiaSolar * 100) / 100,
                energiaExportadaHaciaRed: Math.round(data[h - 1].energiaExportadaHaciaRed * 100) / 100,
                energiaAutoconsumoINH: Math.round(data[h - 1].energiaAutoconsumoINH * 100) / 100,
                energiaConsumidaRed: Math.round(data[h - 1].energiaConsumidaRed * 100) / 100,
                consumoEnergiaTotalINH: Math.round(data[h - 1].consumoEnergiaTotalINH * 100) / 100,
                fraccionEnergiaSolarAutoconsumo: Math.round(data[h - 1].fraccionEnergiaSolarAutoconsumo * 100) / 100,
                fraccionEnergiaSolarTotal: Math.round(data[h - 1].fraccionEnergiaSolarTotal * 100) / 100,
                costoEnergiaINH: Math.round(data[h - 1].costoEnergiaINH * 100) / 100,
                energiaTotalINH: Math.round(data[h - 1].energiaTotalINH * 100) / 100,
                costoTotalEnergiaINH: Math.round(data[h - 1].costoTotalEnergiaINH * 100) / 100,
                consumoActualEnergiaRed: Math.round(data[h - 1].consumoActualEnergiaRed * 100) / 100,
                costoEnergiaConsumidaRed: Math.round(data[h - 1].costoEnergiaConsumidaRed * 100) / 100,
                ahorroEnergiaSolar: Math.round(data[h - 1].ahorroEnergiaSolar * 100) / 100,
                ahorroSolar: Math.round(data[h - 1].ahorroSolar * 100) / 100,
                produccionRealEnergiaSolar: Math.round(data[h - 1].produccionRealEnergiaSolar * 100) / 100,
                produccionEstimadaEnergiaSolar: Math.round(data[h - 1].produccionEstimadaEnergiaSolar * 100) / 100,
                degradacionMaxima: Math.round(data[h - 1].degradacionMaxima * 100) / 100,
                porcentajeCumplimiento: Math.round(data[h - 1].porcentajeCumplimiento * 100) / 100
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
                'Producción total Energía Solar (kWh/mes)': Math.round(data[h - 1].produccionTotalEnergiaSolar * 100) / 100,
                'Energía exportada hacia la red (kWh/mes)': Math.round(data[h - 1].energiaExportadaHaciaRed * 100) / 100,
                'Energía en autoconsumo en INHDELVA (kWh/mes)': Math.round(data[h - 1].energiaAutoconsumoINH * 100) / 100,
                'Energía consumida de la red (kWh/mes)': Math.round(data[h - 1].energiaConsumidaRed * 100) / 100,
                'Consumo de energía total INHDELVA (kWh/mes)': Math.round(data[h - 1].consumoEnergiaTotalINH * 100) / 100,
                'Fraccion de energía solar en autoconsumo (%)': Math.round(data[h - 1].fraccionEnergiaSolarAutoconsumo * 100) / 100,
                'Fraccion de energía solar total (%)': Math.round(data[h - 1].fraccionEnergiaSolarTotal * 100) / 100,
                'Costo de Energia INHDELVA (Lps/kWh)': Math.round(data[h - 1].costoEnergiaINH * 100) / 100,
                'Energia total INHDELVA (kWh/año)': Math.round(data[h - 1].energiaTotalINH * 100) / 100,
                'Costo total de energía INHDELVA (Lps)': Math.round(data[h - 1].costoTotalEnergiaINH * 100) / 100,
                'Consumo actual de energía de la red (kWh/año)': Math.round(data[h - 1].consumoActualEnergiaRed * 100) / 100,
                'Costo energía consumida de la red (Lps)': Math.round(data[h - 1].costoEnergiaConsumidaRed * 100) / 100,
                'Ahorro en energía por sistema solar (kWh/año)': Math.round(data[h - 1].ahorroEnergiaSolar * 100) / 100,
                'Ahorro por sistema solar (Lps)': Math.round(data[h - 1].ahorroSolar * 100) / 100,
                'Producción real Energia Solar (kWh/mes)': Math.round(data[h - 1].produccionRealEnergiaSolar * 100) / 100,
                'Producción estimada energía solar P50 (kWh/mes)': Math.round(data[h - 1].produccionEstimadaEnergiaSolar * 100) / 100,
                'Degradacion maxima según garantia de modulos (%)': Math.round(data[h - 1].degradacionMaxima * 100) / 100,
                'Porcentaje de cumplimiento (%)': Math.round(data[h - 1].porcentajeCumplimiento * 100) / 100
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
                      produccionTotalEnergiaSolar: Math.round((elemento.produccionTotalEnergiaSolar + valorActual.produccionTotalEnergiaSolar) * 100) / 100,
                      energiaExportadaHaciaRed: Math.round((elemento.energiaExportadaHaciaRed + valorActual.energiaExportadaHaciaRed) * 100) / 100,
                      energiaAutoconsumoINH: Math.round((elemento.energiaAutoconsumoINH + valorActual.energiaAutoconsumoINH) * 100) / 100,
                      energiaConsumidaRed: Math.round((elemento.energiaConsumidaRed + valorActual.energiaConsumidaRed) * 100) / 100,
                      consumoEnergiaTotalINH: Math.round((elemento.consumoEnergiaTotalINH + valorActual.consumoEnergiaTotalINH) * 100) / 100,
                      fraccionEnergiaSolarAutoconsumo: Math.round((elemento.fraccionEnergiaSolarAutoconsumo + valorActual.fraccionEnergiaSolarAutoconsumo) * 100) / 100,
                      fraccionEnergiaSolarTotal: Math.round((elemento.fraccionEnergiaSolarTotal + valorActual.fraccionEnergiaSolarTotal) * 100) / 100,
                      costoEnergiaINH: Math.round((elemento.costoEnergiaINH + valorActual.costoEnergiaINH) * 100) / 100,
                      energiaTotalINH: Math.round((elemento.energiaTotalINH + valorActual.energiaTotalINH) * 100) / 100,
                      costoTotalEnergiaINH: Math.round((elemento.costoTotalEnergiaINH + valorActual.costoTotalEnergiaINH) * 100) / 100,
                      consumoActualEnergiaRed: Math.round((elemento.consumoActualEnergiaRed + valorActual.consumoActualEnergiaRed) * 100) / 100,
                      costoEnergiaConsumidaRed: Math.round((elemento.costoEnergiaConsumidaRed + valorActual.costoEnergiaConsumidaRed) * 100) / 100,
                      ahorroEnergiaSolar: Math.round((elemento.ahorroEnergiaSolar + valorActual.ahorroEnergiaSolar) * 100) / 100,
                      ahorroSolar: Math.round((elemento.ahorroSolar + valorActual.ahorroSolar) * 100) / 100,
                      produccionRealEnergiaSolar: Math.round((elemento.produccionRealEnergiaSolar + valorActual.produccionRealEnergiaSolar) * 100) / 100,
                      produccionEstimadaEnergiaSolar: Math.round((elemento.produccionEstimadaEnergiaSolar + valorActual.produccionEstimadaEnergiaSolar) * 100) / 100,
                      degradacionMaxima: Math.round((elemento.degradacionMaxima + valorActual.degradacionMaxima) * 100) / 100,
                      porcentajeCumplimiento: Math.round((elemento.porcentajeCumplimiento + valorActual.porcentajeCumplimiento) * 100) / 100
                    };
                  }
                  return elemento;
                });
              }
            
              return [...acumulador, valorActual];
            }, []);

            console.log(this.listaTotales);
            console.log(this.listOfDataProduccion);
            
            this.listaTotales.forEach(y => {
              this.dataExport = [...this.dataExport, {
                'Año de operación': '',
                'Mes de operación': '',
                'Mes calendario': '',
                'Año calendario': `AÑO ${(y.x === undefined) ? 1 : y.x}`,
                'Fecha': 'TOTAL',
                'Producción total Energía Solar (kWh/mes)': Math.round(y.produccionTotalEnergiaSolar * 100) / 100,
                'Energía exportada hacia la red (kWh/mes)': Math.round(y.energiaExportadaHaciaRed * 100) / 100,
                'Energía en autoconsumo en INHDELVA (kWh/mes)': Math.round(y.energiaAutoconsumoINH * 100) / 100,
                'Energía consumida de la red (kWh/mes)': Math.round(y.energiaConsumidaRed * 100) / 100,
                'Consumo de energía total INHDELVA (kWh/mes)': Math.round(y.consumoEnergiaTotalINH * 100) / 100,
                'Fraccion de energía solar en autoconsumo (%)': Math.round(y.fraccionEnergiaSolarAutoconsumo * 100) / 100,
                'Fraccion de energía solar total (%)': Math.round(y.fraccionEnergiaSolarTotal * 100) / 100,
                'Costo de Energia INHDELVA (Lps/kWh)': Math.round(y.costoEnergiaINH * 100) / 100,
                'Energia total INHDELVA (kWh/año)': Math.round(y.energiaTotalINH * 100) / 100,
                'Costo total de energía INHDELVA (Lps)': Math.round(y.costoTotalEnergiaINH * 100) / 100,
                'Consumo actual de energía de la red (kWh/año)': Math.round(y.consumoActualEnergiaRed * 100) / 100,
                'Costo energía consumida de la red (Lps)': Math.round(y.costoEnergiaConsumidaRed * 100) / 100,
                'Ahorro en energía por sistema solar (kWh/año)': Math.round(y.ahorroEnergiaSolar * 100) / 100,
                'Ahorro por sistema solar (Lps)': Math.round(y.ahorroSolar * 100) / 100,
                'Producción real Energia Solar (kWh/mes)': Math.round(y.produccionRealEnergiaSolar * 100) / 100,
                'Producción estimada energía solar P50 (kWh/mes)': Math.round(y.produccionEstimadaEnergiaSolar * 100) / 100,
                'Degradacion maxima según garantia de modulos (%)': Math.round(y.degradacionMaxima * 100) / 100,
                'Porcentaje de cumplimiento (%)': Math.round(y.porcentajeCumplimiento * 100) / 100
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
    // let pag = Math.round(tamano / 4);

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
    this.dataPDFExport[15] = this.dataPDF[15].slice(0, 4);
    this.dataPDFExport[16] = this.dataPDF[16].slice(0, 4);
    this.dataPDFExport[17] = this.dataPDF[17].slice(0, 4);
    this.dataPDFExport[18] = this.dataPDF[18].slice(0, 4);
    this.dataPDFExport[19] = this.dataPDF[19].slice(0, 4);
    this.dataPDFExport[20] = this.dataPDF[20].slice(0, 4);
    this.dataPDFExport[21] = this.dataPDF[21].slice(0, 4);

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
      this.dataPDFExport[15] = this.dataPDF[15].slice(x, (x + 4));
      this.dataPDFExport[16] = this.dataPDF[16].slice(x, (x + 4));
      this.dataPDFExport[17] = this.dataPDF[17].slice(x, (x + 4));
      this.dataPDFExport[18] = this.dataPDF[18].slice(x, (x + 4));
      this.dataPDFExport[19] = this.dataPDF[19].slice(x, (x + 4));
      this.dataPDFExport[20] = this.dataPDF[20].slice(x, (x + 4));
      this.dataPDFExport[21] = this.dataPDF[21].slice(x, (x + 4));

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
