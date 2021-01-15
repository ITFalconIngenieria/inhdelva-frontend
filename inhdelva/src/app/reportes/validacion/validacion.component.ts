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

  listOfData: any[] = [];
  colspan: number;
  dataInh: any[] = [];
  dataUsu: any[] = [];

  colsUSU: any[];
  colsExportUSU: any[] = [];
  dataPDFUSU: any[] = [];
  dataPDFExportUSU: any[] = [];

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
        moment(moment(this.fechas[0]).format('YYYY-MM-DD')).toISOString(),
        moment(moment(this.fechas[1]).format('YYYY-MM-DD')).toISOString()
      )
        .toPromise()
        .then(
          (data: any[]) => {
            this.isVisible = true;
            this.listOfData = data;
            this.colspan = data.length;

            this.listOfData.forEach(x => {
              this.dataUsu = [...this.dataUsu, {
                'FECHA': moment(x.fecha).format('MM-YYYY'),
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)': x.consumoTotalEAFact,
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)': x.consumoTotalEASC,
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes)': x.consumoTotalEAI,
                'PERDIDA TOTAL DE ENERGIA INTERNA (kWh/mes)': x.perdidaTotal,
                'TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)': x.totalEAexportada,
                'CARGO TOTAL POR ENERGIA A LOS USUARIOS (US$)': x.cargoTotalEA,
                'CARGO TOTAL POR POTENCIA A LOS USUARIOS (US$)': x.cargoTotalPotencia,
                'CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (US$)': x.cargoTotalER,
                'CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (US$)': x.cargoTotalCO,
                'CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (US$)': x.cargoTotalCSC,
                'CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (US$)': x.cargoTotalIlum,
                'CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (US$)': x.cargoPI,
                'FACTURACION TOTAL A LOS USUARIOS (US$)': x.facturacionTotal,
                'DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (US$)': x.diferenciaFacturacionConsumo,
                'PORCENTAJE DE DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (%)': x.porcentajeDiferencia
              }]
            });

            this.colsUSU = [['Descripcion', ...this.dataUsu.map(x => x.FECHA)]]
            this.dataPDFUSU = [
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)', ...this.dataUsu.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS USUARIOS (kWh/mes)'])],
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)', ...this.dataUsu.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE SERVICIOS COMUNITARIOS (kWh/mes)'])],
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes))', ...this.dataUsu.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE ILUMINACION COMUNITARIA (kWh/mes)'])],
              ['PERDIDA TOTAL DE ENERGIA INTERNA (kWh/mes)', ...this.dataUsu.map(x => x['PERDIDA TOTAL DE ENERGIA INTERNA (kWh/mes)'])],
              ['TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)', ...this.dataUsu.map(x => x['TOTAL DE ENERGIA REQUERIDA DE INHDELVA (kWh/mes)'])],
              ['CARGO TOTAL POR ENERGIA A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR ENERGIA A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR POTENCIA A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR POTENCIA A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR ENERGIA REACTIVA A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR COSTOS OPERATIVOS A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR CONSUMOS COMUNITARIOS A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR ILUMINACION COMUNITARIA A LOS USUARIOS (US$)'])],
              ['CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['CARGO TOTAL POR PERDIDAS INTERNAS A LOS USUARIOS (US$)'])],
              ['FACTURACION TOTAL A LOS USUARIOS (US$)', ...this.dataUsu.map(x => x['FACTURACION TOTAL A LOS USUARIOS (US$)'])],
              ['DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (US$)', ...this.dataUsu.map(x => x['DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (US$)'])],
              ['PORCENTAJE DE DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (%)', ...this.dataUsu.map(x => x['PORCENTAJE DE DIFERENCIA ENTRE FACTURACION DE USUARIOS Y CONSUMO DE INHDELVA (%)'])]
            ]

            this.listOfData.forEach(element => {
              this.dataInh = [...this.dataInh, {
                'FECHA': moment(element.fecha).format('MM-YYYY'),
                'CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)': element.consumoTotalEA,
                'TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)': element.totalEAexportada,
                'TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)': element.totalEnergiaProducidaAuto,
                'TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)': element.totalEnergiaConsumida,
                'TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)': element.totalEnergiaProducida,
                'FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)': element.FraccionEnergiaSoalr,
                'CARGO POR ENERGIA A INHDELVA (US$)': element.cargoEnergia,
                'CARGO POR POTENCIA A INHDELVA (US$)': element.cargoPotencia,
                'CARGO POR ENERGIA REACTIVA A INHDELVA (US$)': 0,
                'CARGO POR ALUMBRADO PUBLICO A INHDELVA (US$)': element.cargoAlumbrado,
                'CARGO POR COMERCIALIZACION A INHDELVA (US$)': element.cargoComercializacion,
                'CARGO POR REGULACION A INHDELVA (US$)': element.cargoRegulacion,
                'PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)': element.totalProveedores
              }]
            });

            this.colsINH = [['Descripcion', ...this.dataInh.map(x => x.FECHA)]]
            this.dataPDFINH = [
              ['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)', ...this.dataInh.map(x => x['CONSUMO TOTAL DE ENERGIA ACTIVA DE LOS PROVEEDORES DE ENERGIA (kWh/mes)'])],
              ['TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)', ...this.dataInh.map(x => x['TOTAL DE ENERGIA ACTIVA EXPORTADA HACIA LOS PROVEEDORES DE ENERGIA (kWh/mes)'])],
              ['TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)', ...this.dataInh.map(x => x['TOTAL DE ENERGIA PRODUCIDA EN AUTOCONSUMO (kWh/mes)'])],
              ['TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)', ...this.dataInh.map(x => x['TOTAL DE ENERGIA CONSUMIDA INHDELVA (kWh/mes)'])],
              ['TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)', ...this.dataInh.map(x => x['TOTAL DE ENERGIA PRODUCIDA SISTEMA SOLAR (kWh/mes)'])],
              ['FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)', ...this.dataInh.map(x => x['FRACCION DE ENERGIA SOLAR TOTAL (kWh/mes)'])],
              ['CARGO POR ENERGIA A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR ENERGIA A INHDELVA (US$)'])],
              ['CARGO POR POTENCIA A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR POTENCIA A INHDELVA (US$)'])],
              ['CARGO POR ENERGIA REACTIVA A INHDELVA (US$)', ...this.dataInh.map(x => x['CCARGO POR ENERGIA REACTIVA A INHDELVA (US$)'])],
              ['CARGO POR ALUMBRADO PUBLICO A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR ALUMBRADO PUBLICO A INHDELVA (US$)'])],
              ['CARGO POR COMERCIALIZACION A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR COMERCIALIZACION A INHDELVA (US$)'])],
              ['CARGO POR REGULACION A INHDELVA (US$)', ...this.dataInh.map(x => x['CARGO POR REGULACION A INHDELVA (US$)'])],
              ['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)', ...this.dataInh.map(x => x['PAGO TOTAL DE ENERGIA ACTIVA A LOS PROVEEDORES DE ENERGIA (US$)'])]
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

    // Excel Inhdelva
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataInh);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'INFORMACIÓN GLOBAL DE INHDELVA');
    });

    // Excel Usuarios
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.dataUsu);
      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'INFORMACION GLOBAL DE LOS USUARIOS DEL PARQUE');
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
    let tamano = this.colsUSU[0].length;

    this.colsExportUSU[0] = this.colsUSU[0].slice(0, 4);
    this.dataPDFExportUSU[0] = this.dataPDFUSU[0].slice(0, 4);
    this.dataPDFExportUSU[1] = this.dataPDFUSU[1].slice(0, 4);
    this.dataPDFExportUSU[2] = this.dataPDFUSU[2].slice(0, 4);
    this.dataPDFExportUSU[3] = this.dataPDFUSU[3].slice(0, 4);
    this.dataPDFExportUSU[4] = this.dataPDFUSU[4].slice(0, 4);
    this.dataPDFExportUSU[5] = this.dataPDFUSU[5].slice(0, 4);
    this.dataPDFExportUSU[6] = this.dataPDFUSU[6].slice(0, 4);
    this.dataPDFExportUSU[7] = this.dataPDFUSU[7].slice(0, 4);
    this.dataPDFExportUSU[8] = this.dataPDFUSU[8].slice(0, 4);
    this.dataPDFExportUSU[9] = this.dataPDFUSU[9].slice(0, 4);
    this.dataPDFExportUSU[10] = this.dataPDFUSU[10].slice(0, 4);
    this.dataPDFExportUSU[11] = this.dataPDFUSU[11].slice(0, 4);
    this.dataPDFExportUSU[12] = this.dataPDFUSU[12].slice(0, 4);
    this.dataPDFExportUSU[13] = this.dataPDFUSU[13].slice(0, 4);
    this.dataPDFExportUSU[14] = this.dataPDFUSU[14].slice(0, 4);

    this.colsExportINH[0] = this.colsINH[0].slice(0, 4);
    this.dataPDFExportINH[0] = this.dataPDFINH[0].slice(0, 4);
    this.dataPDFExportINH[1] = this.dataPDFINH[1].slice(0, 4);
    this.dataPDFExportINH[2] = this.dataPDFINH[2].slice(0, 4);
    this.dataPDFExportINH[3] = this.dataPDFINH[3].slice(0, 4);
    this.dataPDFExportINH[4] = this.dataPDFINH[4].slice(0, 4);
    this.dataPDFExportINH[5] = this.dataPDFINH[5].slice(0, 4);
    this.dataPDFExportINH[6] = this.dataPDFINH[6].slice(0, 4);
    this.dataPDFExportINH[7] = this.dataPDFINH[7].slice(0, 4);
    this.dataPDFExportINH[8] = this.dataPDFINH[8].slice(0, 4);
    this.dataPDFExportINH[9] = this.dataPDFINH[9].slice(0, 4);
    this.dataPDFExportINH[10] = this.dataPDFINH[10].slice(0, 4);
    this.dataPDFExportINH[11] = this.dataPDFINH[11].slice(0, 4);
    this.dataPDFExportINH[12] = this.dataPDFINH[12].slice(0, 4);

    const docUSU = new jspdf('p', 'in', 'letter');
    (docUSU as any).autoTable(
      {
        head: this.colsExportUSU,
        body: this.dataPDFExportUSU,
        theme: 'striped'
      }
    );
    const docINH = new jspdf('p', 'in', 'letter');
    (docINH as any).autoTable(
      {
        head: this.colsExportINH,
        body: this.dataPDFExportINH,
        theme: 'striped'
      }
    );

    for (let x = 4; x < tamano;) {
      this.colsExportUSU[0] = this.colsUSU[0].slice(x, (x + 4));
      this.dataPDFExportUSU[0] = this.dataPDFUSU[0].slice(x, (x + 4));
      this.dataPDFExportUSU[1] = this.dataPDFUSU[1].slice(x, (x + 4));
      this.dataPDFExportUSU[2] = this.dataPDFUSU[2].slice(x, (x + 4));
      this.dataPDFExportUSU[3] = this.dataPDFUSU[3].slice(x, (x + 4));
      this.dataPDFExportUSU[4] = this.dataPDFUSU[4].slice(x, (x + 4));
      this.dataPDFExportUSU[5] = this.dataPDFUSU[5].slice(x, (x + 4));
      this.dataPDFExportUSU[6] = this.dataPDFUSU[6].slice(x, (x + 4));
      this.dataPDFExportUSU[7] = this.dataPDFUSU[7].slice(x, (x + 4));
      this.dataPDFExportUSU[8] = this.dataPDFUSU[8].slice(x, (x + 4));
      this.dataPDFExportUSU[9] = this.dataPDFUSU[9].slice(x, (x + 4));
      this.dataPDFExportUSU[10] = this.dataPDFUSU[10].slice(x, (x + 4));
      this.dataPDFExportUSU[11] = this.dataPDFUSU[11].slice(x, (x + 4));
      this.dataPDFExportUSU[12] = this.dataPDFUSU[12].slice(x, (x + 4));
      this.dataPDFExportUSU[13] = this.dataPDFUSU[13].slice(x, (x + 4));
      this.dataPDFExportUSU[14] = this.dataPDFUSU[14].slice(x, (x + 4));

      this.colsExportINH[0] = this.colsINH[0].slice(x, (x + 4));
      this.dataPDFExportINH[0] = this.dataPDFINH[0].slice(x, (x + 4));
      this.dataPDFExportINH[1] = this.dataPDFINH[1].slice(x, (x + 4));
      this.dataPDFExportINH[2] = this.dataPDFINH[2].slice(x, (x + 4));
      this.dataPDFExportINH[3] = this.dataPDFINH[3].slice(x, (x + 4));
      this.dataPDFExportINH[4] = this.dataPDFINH[4].slice(x, (x + 4));
      this.dataPDFExportINH[5] = this.dataPDFINH[5].slice(x, (x + 4));
      this.dataPDFExportINH[6] = this.dataPDFINH[6].slice(x, (x + 4));
      this.dataPDFExportINH[7] = this.dataPDFINH[7].slice(x, (x + 4));
      this.dataPDFExportINH[8] = this.dataPDFINH[8].slice(x, (x + 4));
      this.dataPDFExportINH[9] = this.dataPDFINH[9].slice(x, (x + 4));
      this.dataPDFExportINH[10] = this.dataPDFINH[10].slice(x, (x + 4));
      this.dataPDFExportINH[11] = this.dataPDFINH[11].slice(x, (x + 4));
      this.dataPDFExportINH[12] = this.dataPDFINH[12].slice(x, (x + 4));

      docUSU.addPage('p');
      (docUSU as any).autoTable(
        {
          head: this.colsExportUSU,
          body: this.dataPDFExportUSU,
          theme: 'striped'
        }
      );

      docINH.addPage('p');
      (docINH as any).autoTable(
        {
          head: this.colsExportINH,
          body: this.dataPDFExportINH,
          theme: 'striped'
        }
      );

      x = x + 4;
    }

    docUSU.save('InformeValidacionUSuarios.pdf');
    docINH.save('InformeValidacionInhdelva.pdf');
  }


}
