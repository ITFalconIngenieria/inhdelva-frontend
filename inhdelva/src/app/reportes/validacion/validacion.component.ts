import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import swal from 'sweetalert';
import { NgxSpinnerService } from 'ngx-spinner';
import { ReportesService } from '../../servicios/reportes.service';
import 'jspdf-autotable';
import jspdf from 'jspdf';

@Component({
  selector: 'app-validacion',
  templateUrl: './validacion.component.html',
  styleUrls: ['./validacion.component.scss']
})
export class ValidacionComponent implements OnInit {
  formatNumber = new Intl.NumberFormat;
  listOfData: any[] = [];
  colspan: number;
  dataInh: any[] = [];
  dataReporte: any[] = [];

  cols: any[];
  colsExportReporte: any[] = [];
  dataPDFReporte: any[] = [];
  dataPDFExportReporte: any[] = [];

  colsINH: any[];
  colsExportINH: any[] = [];
  dataPDFINH: any[] = [];
  dataPDFExportINH: any[] = [];

  isVisible = false;
  fechas = null;
  constructor(
    private spinner: NgxSpinnerService,
    private reporteService: ReportesService
  ) { }

  ngOnInit() {
  }

  consultar() {
    this.listOfData = [];
    this.dataInh = [];
    this.dataReporte = [];
    this.colsINH = [];
    this.cols = [];
    this.dataPDFINH = [];
    this.dataPDFReporte = [];
    this.dataPDFExportReporte = [];
    this.dataPDFExportINH = [];
    this.colsExportINH = [];
    this.colsExportReporte = [];

    this.spinner.show();
    if (this.fechas === null) {
      swal({
        icon: 'warning',
        title: 'No se puede consultar',
        text: 'Debe seleccionar un rango de fechas'
      });
      this.isVisible = false;
    } else {

      this.reporteService.validacion(
        moment(`${moment(this.fechas[0]).format('YYYY-MM-DD')}T06:00:00.000Z`).toISOString(),
        moment(`${moment(this.fechas[1]).format('YYYY-MM-DD')}T06:00:00.000Z`).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.isVisible = true;
            this.listOfData = data;
            this.colspan = data.length;
            console.log(data);

            this.listOfData.forEach(x => {
              this.dataReporte = [...this.dataReporte, {
                'FECHA': moment(x.fecha).format('MM-YYYY'),
                'INFORMACIÓN GLOBAL DE INHDELVA': '',
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.consumoTotalEA),
                'TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.totalEAexportada),
                'TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.totalEnergiaProducidaAuto),
                'TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.totalEnergiaConsumida),
                'TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.totalEnergiaProducida),
                'FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 4 }).format(x.FraccionEnergiaSolar),
                'CARGO POR ENERGIA A INHDELVA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoEnergia),
                'CARGO POR POTENCIA A INHDELVA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoPotencia),
                'CARGO POR ENERGIA REACTIVA A INHDELVA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoReactiva),
                'CARGO POR ALUMBRADO PUBLICO A INHDELVA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoAlumbrado),
                'CARGO POR COMERCIALIZACION A INHDELVA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoComercializacion),
                'CARGO POR REGULACION A INHDELVA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoRegulacion),
                'PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.totalProveedores),
                'INFORMACION GLOBAL DE LOS USUARIOS DEL PARQUE': '',
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.consumoTotalEAFact),
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.consumoTotalEASC),
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.consumoTotalEAI),
                'PERDIDA TOTAL DE ENERGIA USUARIOS DE MEDIA TENSION (MT)(kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.perdidaTotalMT),
                'PERDIDA TOTAL DE ENERGIA USUARIOS DE BAJA TENSION (BT)(kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.perdidaTotalBT),
                'PERDIDA TOTAL DE ENERGIA INTERNA USUARIOS (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.perdidaTotal),
                'PORCENTAJE DE PERDIDA TOTAL DE ENERGIA INTERNA (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.perdidaTotalPor ),
                'TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.totalEnergiaINH),
                'CARGO TOTAL POR ENERGIA A LOS USUARIOS (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoTotalEA),
                'CARGO TOTAL POR POTENCIA A LOS USUARIOS (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoTotalPotencia),
                'CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoTotalER),
                'CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoTotalCO),
                'CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoTotalCSC),
                'CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoTotalIlum),
                'CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.cargoPI),
                'FACTURACION TOTAL A LOS USUARIOS (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.facturacionTotal),
                'MARGEN GLOBAL FACTURACION': '',
                'COSTO ENERGIA SOLAR (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.costoEnergiaSolar),
                'COSTOS SERVICIOS ADMINISTRATIVOS, MANTENIMIENTO DE RED DE DISTRIBUCION Y EQUIPOS AUXILIARES (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.costoMant),
                'DIFERENCIA ENTRE FACTURACION DE USUARIOS, CONSUMO DE INHDELVA Y COSTOS ENERGIA SOLAR (Lps)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.diferenciaFacturacionConsumo),
                'MARGEN GLOBAL DE LA FACTURACION A LOS USUARIOS (%)': new Intl.NumberFormat('en-us', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(x.porcentajeDiferencia )
              }]
            });

            this.cols = [['Descripcion', ...this.dataReporte.map(x => x.FECHA)]]
            this.dataPDFReporte = [
              ['INFORMACIÓN GLOBAL DE INHDELVA', ...this.dataReporte.map(x => x['INFORMACIÓN GLOBAL DE INHDELVA'])],
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)', ...this.dataReporte.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)'])],
              ['TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)', ...this.dataReporte.map(x => x['TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)'])],
              ['TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)', ...this.dataReporte.map(x => x['TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)'])],
              ['TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)', ...this.dataReporte.map(x => x['TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)'])],
              ['TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)', ...this.dataReporte.map(x => x['TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)'])],
              ['FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)', ...this.dataReporte.map(x => x['FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)'])],
              ['CARGO POR ENERGIA A INHDELVA (Lps)', ...this.dataReporte.map(x => x['CARGO POR ENERGIA A INHDELVA (Lps)'])],
              ['CARGO POR POTENCIA A INHDELVA (Lps)', ...this.dataReporte.map(x => x['CARGO POR POTENCIA A INHDELVA (Lps)'])],
              ['CARGO POR ENERGIA REACTIVA A INHDELVA (Lps)', ...this.dataReporte.map(x => x['CARGO POR ENERGIA REACTIVA A INHDELVA (Lps)'])],
              ['CARGO POR ALUMBRADO PUBLICO A INHDELVA (Lps)', ...this.dataReporte.map(x => x['CARGO POR ALUMBRADO PUBLICO A INHDELVA (Lps)'])],
              ['CARGO POR COMERCIALIZACION A INHDELVA (Lps)', ...this.dataReporte.map(x => x['CARGO POR COMERCIALIZACION A INHDELVA (Lps)'])],
              ['CARGO POR REGULACION A INHDELVA (Lps)', ...this.dataReporte.map(x => x['CARGO POR REGULACION A INHDELVA (Lps)'])],
              ['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (Lps)', ...this.dataReporte.map(x => x['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (Lps)'])],
              ['INFORMACION GLOBAL DE LOS USUARIOS DEL PARQUE', ...this.dataReporte.map(x => x['INFORMACION GLOBAL DE LOS USUARIOS DEL PARQUE'])],
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)', ...this.dataReporte.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)'])],
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)', ...this.dataReporte.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)'])],
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes))', ...this.dataReporte.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes)'])],
              ['PERDIDA TOTAL DE ENERGIA USUARIOS DE MEDIA TENSION (MT)(kWh/mes)', ...this.dataReporte.map(x => x['PERDIDA TOTAL DE ENERGIA USUARIOS DE MEDIA TENSION (MT)(kWh/mes)'])],
              ['PERDIDA TOTAL DE ENERGIA USUARIOS DE BAJA TENSION (BT)(kWh/mes)', ...this.dataReporte.map(x => x['PERDIDA TOTAL DE ENERGIA USUARIOS DE BAJA TENSION (BT)(kWh/mes)'])],
              ['PERDIDA TOTAL DE ENERGIA INTERNA USUARIOS (kWh/mes)', ...this.dataReporte.map(x => x['PERDIDA TOTAL DE ENERGIA INTERNA USUARIOS (kWh/mes)'])],
              ['PORCENTAJE DE PERDIDA TOTAL DE ENERGIA INTERNA (%)', ...this.dataReporte.map(x => x['PORCENTAJE DE PERDIDA TOTAL DE ENERGIA INTERNA (%)'])],
              ['TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)', ...this.dataReporte.map(x => x['TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)'])],
              ['CARGO TOTAL POR ENERGIA A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['CARGO TOTAL POR ENERGIA A LOS USUARIOS (Lps)'])],
              ['CARGO TOTAL POR POTENCIA A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['CARGO TOTAL POR POTENCIA A LOS USUARIOS (Lps)'])],
              ['CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (Lps)'])],
              ['CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (Lps)'])],
              ['CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (Lps)'])],
              ['CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (Lps)'])],
              ['CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (Lps)'])],
              ['FACTURACION TOTAL A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['FACTURACION TOTAL A LOS USUARIOS (Lps)'])],
              ['MARGEN GLOBAL FACTURACION', ...this.dataReporte.map(x => x['MARGEN GLOBAL FACTURACION'])],
              ['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (Lps)', ...this.dataReporte.map(x => x['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (Lps)'])],
              ['COSTO ENERGIA SOLAR (Lps)', ...this.dataReporte.map(x => x['COSTO ENERGIA SOLAR (Lps)'])],
              ['COSTOS SERVICIOS ADMINISTRATIVOS, MANTENIMIENTO DE RED DE DISTRIBUCION Y EQUIPOS AUXILIARES (Lps)', ...this.dataReporte.map(x => x['COSTOS SERVICIOS ADMINISTRATIVOS, MANTENIMIENTO DE RED DE DISTRIBUCION Y EQUIPOS AUXILIARES (Lps)'])],
              ['FACTURACION TOTAL A LOS USUARIOS (Lps)', ...this.dataReporte.map(x => x['FACTURACION TOTAL A LOS USUARIOS (Lps)'])],
              ['DIFERENCIA ENTRE FACTURACION DE USUARIOS, CONSUMO DE INHDELVA Y COSTOS ENERGIA SOLAR (Lps)', ...this.dataReporte.map(x => x['DIFERENCIA ENTRE FACTURACION DE USUARIOS, CONSUMO DE INHDELVA Y COSTOS ENERGIA SOLAR (Lps)'])],
              ['MARGEN GLOBAL DE LA FACTURACION A LOS USUARIOS (%)', ...this.dataReporte.map(x => x['MARGEN GLOBAL DE LA FACTURACION A LOS USUARIOS (%)'])]
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

  exportExcel() {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataReporte);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'REPORTE DE VALIDACION');
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

  exportPdf() {
    let tamano = this.cols[0].length;

    this.colsExportReporte[0] = this.cols[0].slice(0, 6);
    this.dataPDFExportReporte[0] = this.dataPDFReporte[0].slice(0, 6);
    this.dataPDFExportReporte[1] = this.dataPDFReporte[1].slice(0, 6);
    this.dataPDFExportReporte[2] = this.dataPDFReporte[2].slice(0, 6);
    this.dataPDFExportReporte[3] = this.dataPDFReporte[3].slice(0, 6);
    this.dataPDFExportReporte[4] = this.dataPDFReporte[4].slice(0, 6);
    this.dataPDFExportReporte[5] = this.dataPDFReporte[5].slice(0, 6);
    this.dataPDFExportReporte[6] = this.dataPDFReporte[6].slice(0, 6);
    this.dataPDFExportReporte[7] = this.dataPDFReporte[7].slice(0, 6);
    this.dataPDFExportReporte[8] = this.dataPDFReporte[8].slice(0, 6);
    this.dataPDFExportReporte[9] = this.dataPDFReporte[9].slice(0, 6);
    this.dataPDFExportReporte[10] = this.dataPDFReporte[10].slice(0, 6);
    this.dataPDFExportReporte[11] = this.dataPDFReporte[11].slice(0, 6);
    this.dataPDFExportReporte[12] = this.dataPDFReporte[12].slice(0, 6);
    this.dataPDFExportReporte[13] = this.dataPDFReporte[13].slice(0, 6);
    this.dataPDFExportReporte[14] = this.dataPDFReporte[14].slice(0, 6);
    this.dataPDFExportReporte[15] = this.dataPDFReporte[15].slice(0, 6);
    this.dataPDFExportReporte[16] = this.dataPDFReporte[16].slice(0, 6);
    this.dataPDFExportReporte[17] = this.dataPDFReporte[17].slice(0, 6);
    this.dataPDFExportReporte[18] = this.dataPDFReporte[18].slice(0, 6);
    this.dataPDFExportReporte[19] = this.dataPDFReporte[19].slice(0, 6);
    this.dataPDFExportReporte[20] = this.dataPDFReporte[20].slice(0, 6);
    this.dataPDFExportReporte[21] = this.dataPDFReporte[21].slice(0, 6);
    this.dataPDFExportReporte[22] = this.dataPDFReporte[22].slice(0, 6);
    this.dataPDFExportReporte[23] = this.dataPDFReporte[23].slice(0, 6);
    this.dataPDFExportReporte[24] = this.dataPDFReporte[24].slice(0, 6);
    this.dataPDFExportReporte[25] = this.dataPDFReporte[25].slice(0, 6);
    this.dataPDFExportReporte[26] = this.dataPDFReporte[26].slice(0, 6);
    this.dataPDFExportReporte[27] = this.dataPDFReporte[27].slice(0, 6);
    this.dataPDFExportReporte[28] = this.dataPDFReporte[28].slice(0, 6);
    this.dataPDFExportReporte[29] = this.dataPDFReporte[29].slice(0, 6);
    this.dataPDFExportReporte[30] = this.dataPDFReporte[30].slice(0, 6)
    this.dataPDFExportReporte[31] = this.dataPDFReporte[31].slice(0, 6);
    this.dataPDFExportReporte[32] = this.dataPDFReporte[32].slice(0, 6);
    this.dataPDFExportReporte[33] = this.dataPDFReporte[33].slice(0, 6);
    this.dataPDFExportReporte[34] = this.dataPDFReporte[34].slice(0, 6);
    this.dataPDFExportReporte[35] = this.dataPDFReporte[35].slice(0, 6);
    this.dataPDFExportReporte[36] = this.dataPDFReporte[36].slice(0, 6);
    this.dataPDFExportReporte[37] = this.dataPDFReporte[37].slice(0, 6);
    
    const doc = new jspdf('p', 'in', 'letter');
    (doc as any).autoTable(
      {
        head: this.colsExportReporte,
        body: this.dataPDFExportReporte,
        theme: 'striped',
        styles: { fontSize: 6, halign: 'right' },
        columnStyles: {
          0 : { halign : 'left' } 
        }
      }
    );

    for (let x = 6; x < tamano;) {
      this.colsExportReporte[0] = this.cols[0].slice(x, (x + 6));
      this.dataPDFExportReporte[0] = this.dataPDFReporte[0].slice(x, (x + 6));
      this.dataPDFExportReporte[1] = this.dataPDFReporte[1].slice(x, (x + 6));
      this.dataPDFExportReporte[2] = this.dataPDFReporte[2].slice(x, (x + 6));
      this.dataPDFExportReporte[3] = this.dataPDFReporte[3].slice(x, (x + 6));
      this.dataPDFExportReporte[4] = this.dataPDFReporte[4].slice(x, (x + 6));
      this.dataPDFExportReporte[5] = this.dataPDFReporte[5].slice(x, (x + 6));
      this.dataPDFExportReporte[6] = this.dataPDFReporte[6].slice(x, (x + 6));
      this.dataPDFExportReporte[7] = this.dataPDFReporte[7].slice(x, (x + 6));
      this.dataPDFExportReporte[8] = this.dataPDFReporte[8].slice(x, (x + 6));
      this.dataPDFExportReporte[9] = this.dataPDFReporte[9].slice(x, (x + 6));
      this.dataPDFExportReporte[10] = this.dataPDFReporte[10].slice(x, (x + 6));
      this.dataPDFExportReporte[11] = this.dataPDFReporte[11].slice(x, (x + 6));
      this.dataPDFExportReporte[12] = this.dataPDFReporte[12].slice(x, (x + 6));
      this.dataPDFExportReporte[13] = this.dataPDFReporte[13].slice(x, (x + 6));
      this.dataPDFExportReporte[14] = this.dataPDFReporte[14].slice(x, (x + 6));
      this.dataPDFExportReporte[15] = this.dataPDFReporte[15].slice(x, (x + 6));
      this.dataPDFExportReporte[16] = this.dataPDFReporte[16].slice(x, (x + 6));
      this.dataPDFExportReporte[17] = this.dataPDFReporte[17].slice(x, (x + 6));
      this.dataPDFExportReporte[18] = this.dataPDFReporte[18].slice(x, (x + 6));
      this.dataPDFExportReporte[19] = this.dataPDFReporte[19].slice(x, (x + 6));
      this.dataPDFExportReporte[20] = this.dataPDFReporte[20].slice(x, (x + 6));
      this.dataPDFExportReporte[21] = this.dataPDFReporte[21].slice(x, (x + 6));
      this.dataPDFExportReporte[22] = this.dataPDFReporte[22].slice(x, (x + 6));
      this.dataPDFExportReporte[23] = this.dataPDFReporte[23].slice(x, (x + 6));
      this.dataPDFExportReporte[24] = this.dataPDFReporte[24].slice(x, (x + 6));
      this.dataPDFExportReporte[25] = this.dataPDFReporte[25].slice(x, (x + 6));
      this.dataPDFExportReporte[26] = this.dataPDFReporte[26].slice(x, (x + 6));
      this.dataPDFExportReporte[27] = this.dataPDFReporte[27].slice(x, (x + 6));
      this.dataPDFExportReporte[28] = this.dataPDFReporte[28].slice(x, (x + 6));
      this.dataPDFExportReporte[29] = this.dataPDFReporte[29].slice(x, (x + 6));
      this.dataPDFExportReporte[30] = this.dataPDFReporte[30].slice(x, (x + 6));
      this.dataPDFExportReporte[31] = this.dataPDFReporte[31].slice(x, (x + 6));
      this.dataPDFExportReporte[32] = this.dataPDFReporte[32].slice(x, (x + 6));
      this.dataPDFExportReporte[33] = this.dataPDFReporte[33].slice(x, (x + 6));
      this.dataPDFExportReporte[34] = this.dataPDFReporte[34].slice(x, (x + 6));
      this.dataPDFExportReporte[35] = this.dataPDFReporte[35].slice(x, (x + 6));
      this.dataPDFExportReporte[36] = this.dataPDFReporte[36].slice(x, (x + 6));
      this.dataPDFExportReporte[37] = this.dataPDFReporte[37].slice(x, (x + 6));

      doc.addPage('p');
      (doc as any).autoTable(
        {
          head: this.colsExportReporte,
          body: this.dataPDFExportReporte,
          theme: 'striped',
          styles: { fontSize: 6, halign: 'right' },
          columnStyles: {
            0 : { halign : 'left' } 
          }
        }
      );

      x = x + 6;
    }

    doc.save('REPORTE DE VALIDACION.pdf');
  }


}
